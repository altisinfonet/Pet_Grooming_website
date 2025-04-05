import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import GroomingLeads from '@/admin/Pages/lead/groomingLeads'

const ListOperatorPage = () => {

    return (
        <ProtectRoute>
            <DefaultLayout>
                <GroomingLeads />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default ListOperatorPage