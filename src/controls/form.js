import createDecorator from 'final-form-submit-listener'
import React, { useEffect, useRef } from 'react'
import { Form as FinalForm, useFormState } from 'react-final-form'
import getFormIssues from 'utils/getFormIssues'

export function Form({
  children,
  className,
  as: Component = 'form',
  style,
  onRequestSubmit,
  onSubmitSucceeded,
  onSubmitFailed,
  ...props
}) {
  let submitCallbacksRef = useRef({
    onRequestSubmit,
    onSubmitSucceeded,
    onSubmitFailed,
  })

  useEffect(() => {
    submitCallbacksRef.current = {
      onRequestSubmit,
      onSubmitSucceeded,
      onSubmitFailed,
    }
  }, [onRequestSubmit, onSubmitSucceeded, onSubmitFailed])

  let formSubmitCallbacksRef = useRef()
  if (!formSubmitCallbacksRef.current) {
    formSubmitCallbacksRef.current = createDecorator({
      beforeSubmit: form => {
        if (submitCallbacksRef.current.onRequestSubmit) {
          submitCallbacksRef.current.onRequestSubmit(
            form.getState().values,
            form,
          )
        }
      },
      afterSubmitSucceeded: form => {
        if (submitCallbacksRef.current.onSubmitSucceeded) {
          submitCallbacksRef.current.onSubmitSucceeded(
            form.getState().values,
            form,
          )
        }
      },
      afterSubmitFailed: form => {
        if (submitCallbacksRef.current.onSubmitFailed) {
          submitCallbacksRef.current.onSubmitFailed(
            form.getState().values,
            form,
          )
        }
      },
    })
  }

  return (
    <FinalForm decorators={[formSubmitCallbacksRef.current]} {...props}>
      {({ handleSubmit }) =>
        React.createElement(Component, {
          children,
          className,
          onSubmit: handleSubmit,
          style,
        })
      }
    </FinalForm>
  )
}

export function FormIssue({ children, ...rest }) {
  let formState = useFormState()
  let issues = getFormIssues({ formState, ...rest })
  return children(issues && Object.values(issues)[0])
}

export default Form
