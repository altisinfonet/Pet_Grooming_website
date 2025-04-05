import DefaultLayout from '@/admin/layout/DefaultLayout'
import AdminCMSPages from '@/admin/Pages/pages/adminCmsPages'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const AdminPages = () => {
  return (
    <ProtectRoute>
      <DefaultLayout>
        <AdminCMSPages />
      </DefaultLayout>
    </ProtectRoute>
  )
}

export default AdminPages