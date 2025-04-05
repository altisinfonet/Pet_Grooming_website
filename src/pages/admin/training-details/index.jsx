import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ViewDetails from '../../../admin/Pages/DogTraining/view'

const ViewDetailsPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <ViewDetails />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default ViewDetailsPage