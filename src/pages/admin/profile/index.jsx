import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import Profile from '../../../admin/Pages/Profile/profile'

const ProfilePage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Profile />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default ProfilePage