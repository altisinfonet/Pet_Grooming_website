import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import CreateAndEditStore from '../../../admin/Pages/operator/create-edit'

const CreateAndEditOperatorPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <CreateAndEditStore />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CreateAndEditOperatorPage