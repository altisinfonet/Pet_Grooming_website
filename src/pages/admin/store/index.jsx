import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import CreateAndEditStore from '../../../admin/Pages/store/create-edit'

const CreateAndEditStorePage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <CreateAndEditStore />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CreateAndEditStorePage