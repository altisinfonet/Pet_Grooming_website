import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import ProfileDetails from '../../client/pages/profileDetails'

const ProfilePage = () => {
    return (
        <div>
            <AuthGuard ><ProfileDetails /></AuthGuard>
        </div>
    )
}

export default ProfilePage