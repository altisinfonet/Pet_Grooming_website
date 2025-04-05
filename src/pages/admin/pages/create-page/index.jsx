import DefaultLayout from '@/admin/layout/DefaultLayout'
import CreatePage from '@/admin/Pages/pages/create-page/adminCmsCreatePage'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const AdminCMSCreatePage = () => {
  return (
    <ProtectRoute>
    <DefaultLayout>
      <CreatePage />
    </DefaultLayout>
  </ProtectRoute>
  )
}

export default AdminCMSCreatePage