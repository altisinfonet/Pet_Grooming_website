import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import SiteOperation from '../../../admin/Pages/Settings/siteOperation'

const SiteOperationPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <SiteOperation />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default SiteOperationPage