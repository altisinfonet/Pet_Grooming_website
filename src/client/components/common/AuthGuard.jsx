import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { checkAuth, tostaHit, tostaHitWarn } from "../../utils/helpers";
// import { Navigate, Route } from "react-router-dom";
// import { checkAuth, tostaHit, tostaHitWarn } from "src/client/utils/helpers";

const AuthGuard = ({ children }) => {
  const isAuthenticated = checkAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      tostaHitWarn("Please login at first");
      router.push("/")
    } else {
      null;
    }
  }, []);

  return <>{isAuthenticated ? children : null}</>;
};

export default AuthGuard;
