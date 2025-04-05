import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppContent from '../components/AppContent';
import { useSelector } from 'react-redux';


const DefaultLayout = ({ children }) => {

  const location = useRouter();

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  return (
    <div>
      {location.pathname === "/admin/pos" ? null : <AppSidebar />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        {location.pathname === "/admin/pos" ? null : <AppHeader />}
        <div className={`${location.pathname === "/admin/pos" ? "pos_page_root" : ""} ${!unfoldable ? "appheader" : "appheader_close"} body flex-grow-1 px-3`}>
          <AppContent >
            {children}
          </AppContent>
        </div>
        {location.pathname === "/admin/pos" ? null : <AppFooter />}
      </div>
    </div >
  )
}

export default DefaultLayout
