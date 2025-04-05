import React from 'react'
import PetTag from '../../../../admin/Pages/PetCategory/PetTag'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'

const BreedPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <PetTag />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BreedPage