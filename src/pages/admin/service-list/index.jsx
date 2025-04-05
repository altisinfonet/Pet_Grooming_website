import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ServiceList from '../../../admin/Pages/Service/serviceList'

const BreedPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <ServiceList />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BreedPage