import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ServiceAdsList from '../../../admin/Pages/Service/serviceAdsList'

const BreedPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <ServiceAdsList />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BreedPage