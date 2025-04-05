import DefaultLayout from '@/admin/layout/DefaultLayout'
import PageTermsAndCondition from '@/admin/Pages/pageTermsAndCondition/pageTermsAndCondition'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const AdminPages = () => {
  return (
    <ProtectRoute>
      <DefaultLayout>
        <PageTermsAndCondition />
      </DefaultLayout>
    </ProtectRoute>
  )
}

export default AdminPages