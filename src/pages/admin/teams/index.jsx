import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import Team from '../../../admin/Pages/Team'

const TeamPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Team />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default TeamPage