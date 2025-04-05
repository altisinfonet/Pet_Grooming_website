import DefaultLayout from '@/admin/layout/DefaultLayout'
import ServiceCategory from '@/admin/Pages/Service/serviceCategory'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const ServiceCategoryPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <ServiceCategory />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default ServiceCategoryPage