import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import BannerPage from '../../../admin/Pages/Banner'

const BannerPagePage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <BannerPage />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BannerPagePage