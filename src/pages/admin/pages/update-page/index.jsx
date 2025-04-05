import DefaultLayout from '@/admin/layout/DefaultLayout'
import UpdateData from '@/admin/Pages/pages/update-page/updateData'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const UpdatePageData = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <UpdateData />
            </DefaultLayout>
        </ProtectRoute>

    )
}

export default UpdatePageData