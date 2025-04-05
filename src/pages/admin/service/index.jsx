import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import Service from '../../../admin/Pages/Service/service'

const AddServicePage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Service />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default AddServicePage