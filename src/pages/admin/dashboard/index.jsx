import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import Dashboard from '../../../admin/views/dashboard/Dashboard'

const DashBoardPage = () => {

    return (
        <ProtectRoute>
            <DefaultLayout>
                <Dashboard />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default DashBoardPage