import React from 'react'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
  const isAuthenticated = Cookies.get('auth')
  

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />
  }

  return children ? children : <Outlet />
}

export default ProtectRoute
