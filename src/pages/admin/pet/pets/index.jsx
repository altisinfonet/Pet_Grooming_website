import React from 'react'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'
import Pets from '../../../../admin/Pages/PetCategory/Pets'

const CoatPage = () => {
    return (
        <ProtectRoute>

            <DefaultLayout>
                <Pets />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CoatPage