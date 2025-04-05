import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import DogTraining from '../../../admin/Pages/DogTraining/list'

const DogTrainingPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <DogTraining />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default DogTrainingPage