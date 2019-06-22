import { createBrowserNavigation } from 'navi'
import React from 'react'
import ReactDOM from 'react-dom'
import { NaviProvider, View } from 'react-navi'
import { StripeProvider } from 'react-stripe-elements'
import config from './config'
import { auth, db } from './firebase'
import routes from './routes'

async function main() {
  let context = {
    currentUser: undefined,
  }

  const navigation = createBrowserNavigation({
    routes,
    context,
  })

  function updateContext(change) {
    context = { ...context, ...change }
    navigation.setContext(context)
  }

  let unsubscribe = null
  auth.onAuthStateChanged(user => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    if (user) {
      // Set state to undefined while updating, so that auth-protected routes
      // will wait for user to load before redirecting.
      if (context.currentUser !== undefined) {
        updateContext({
          currentUser: undefined,
        })
      }

      let docReference = db.collection('users').doc(user.uid)

      unsubscribe = docReference.onSnapshot(doc => {
        if (doc.exists) {
          let data = doc.data()
          let subscriptionStatus =
            data && data.stripeSubscription && data.stripeSubscription.status

          const update = () =>
            updateContext({
              currentUser: {
                ...data,
                ...auth.currentUser,
                subscriptionStatus,
                isPremium: subscriptionStatus === 'active',
                reload: async () => {
                  await auth.currentUser.reload()
                  update()
                },
              },
            })

          // When auth state changes immediately after registration, the user
          // object won't be available yet, so skip the update until it does
          // become available.
          if (data) {
            update()
          }
        } else {
          // If somehow the user object hasn't been created,
          // then let's create it.
          db.collection('users')
            .doc(user.uid)
            .set({
              uid: user.uid,
            })
        }
      })
    } else {
      updateContext({
        currentUser: null,
      })
    }
  })

  await navigation.getRoute()

  ReactDOM.hydrate(
    <StripeProvider stripe={window.Stripe(config.stripe.apiKey)}>
      <NaviProvider navigation={navigation}>
        <View />
      </NaviProvider>
    </StripeProvider>,
    document.getElementById('root'),
  )
}

main()
