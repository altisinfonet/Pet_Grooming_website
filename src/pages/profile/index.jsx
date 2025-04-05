import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import Profile from '../../client/pages/profile'

const ProfilePage = () => {
    return (
        <div>
            <AuthGuard ><Profile /></AuthGuard>
        </div>
    )
}

export default ProfilePage