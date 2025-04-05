import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import DogTrainerList from '../../../admin/Pages/DogTrainer/list'

const DogTrainerListPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <DogTrainerList />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default DogTrainerListPage