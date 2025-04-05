import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check authentication status only on client-side
    const authStatus = Cookies.get('auth') || (typeof window !== "undefined" && localStorage.getItem('_auth'));
    // console.log(authStatus)
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      router.push('/admin/login');
    }
  }, [router]);

  // Wait until we confirm the authentication status before rendering
  if (isAuthenticated === null) return null;

  // Render children if authenticated
  return isAuthenticated ? children : null;
};

export default ProtectRoute;
