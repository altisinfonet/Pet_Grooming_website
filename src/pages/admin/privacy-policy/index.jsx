import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import PrivacyPolicy from '../../../admin/Pages/PrivacyPolicy/privacyPolicy'
import AdminCMSPages from '@/admin/Pages/pages/adminCmsPages'

const PrivacyPolicyPage = () => {
    return (
        // <ProtectRoute>
        //     <DefaultLayout>
        //         <PrivacyPolicy />
        //     </DefaultLayout>
        // </ProtectRoute>

        <ProtectRoute>
            <DefaultLayout>
                <AdminCMSPages />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default PrivacyPolicyPage