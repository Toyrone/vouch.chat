const admin = require('firebase-admin')
const functions = require('firebase-functions')
const renderer = require('./renderer')

const serviceAccount = require('./.serviceaccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

exports.renderer = functions.https.onRequest(renderer)

exports.api = {
  ...require('./api/createFreeAccount'),
  ...require('./api/payAndSubscribe'),
  ...require('./api/plans'),
  ...require('./api/upgradeSubscriptionPlan'),
  ...require('./api/usernames'),
}
