import DefaultLayout from '@/admin/layout/DefaultLayout'
import UpdatePageTramsAndCondition from '@/admin/Pages/pageTermsAndCondition/updatePageTramsAndCondition/updatePageTramsAndCondition'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const AdminPages = () => {
  return (
    <ProtectRoute>
      <DefaultLayout>
        <UpdatePageTramsAndCondition />
      </DefaultLayout>
    </ProtectRoute>
  )
}

export default AdminPages