import React from 'react'
import { Route } from 'react-router-dom'
import Error403 from 'components/Error403'

const ProtectedRoute = ({
  path,
  component,
  authentication,
  authRequired,
  exact,
}) => {
  const { logged } = authentication || {}

  const show = (authRequired && logged) || !authRequired
  const render = show ? component : Error403

  return <Route path={path} component={render} exact={exact} />
}

export default ProtectedRoute
