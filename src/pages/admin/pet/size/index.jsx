import React from 'react'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'
import PetType from '../../../../admin/Pages/PetCategory/PetTypes'

const CoatPage = () => {
    return (
        <ProtectRoute>

            <DefaultLayout>
                <PetType />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CoatPage