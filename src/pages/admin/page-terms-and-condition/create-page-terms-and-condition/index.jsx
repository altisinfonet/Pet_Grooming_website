import DefaultLayout from '@/admin/layout/DefaultLayout'
import CreatePageTermsAndCondition from '@/admin/Pages/pageTermsAndCondition/createPageTramsAndCondition/createPageTermsAndCondition'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const AdminPages = () => {
  return (
    <ProtectRoute>
      <DefaultLayout>
        <CreatePageTermsAndCondition />
      </DefaultLayout>
    </ProtectRoute>
  )
}

export default AdminPages