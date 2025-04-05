import React from 'react'
import PetFur from '../../../../admin/Pages/PetCategory/PetFur'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'

const CoatPage = () => {
    return (
        <ProtectRoute>

            <DefaultLayout>
                <PetFur />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CoatPage