import React, { Suspense } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { CContainer, CPlaceholder, CSpinner } from '@coreui/react'

// Import routes config - for Next.js, this could be an array of routes or components
// import routes from '../../routes'

const AppContent = ({ children }) => {
  const router = useRouter();

  const loading = (
    <div className="pt-3 text-center">
      <CSpinner className="sk-spinner sk-spinner-pulse" />
    </div>
  );

  return (
    <CContainer lg>
      <Suspense fallback={loading}>
        {/* {routes.map((route, idx) => {
          const RouteComponent = dynamic(() => Promise.resolve(route.element), {
            suspense: true
          });
          return route.element && router.pathname === route.path ? (
            <RouteComponent key={idx} />
          ) : null;
        })} */}
        {children}
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
