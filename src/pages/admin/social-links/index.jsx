import DefaultLayout from '@/admin/layout/DefaultLayout'
import SocialLinks from '@/admin/Pages/socialLinks/socialLinks'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const SocialLinksPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <SocialLinks />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default SocialLinksPage