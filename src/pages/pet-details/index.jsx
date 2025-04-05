import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import PetDetails from '../../client/pages/petDetails'

const PetDetailsPage = () => {
    return (
        <>
            <AuthGuard><PetDetails /></AuthGuard>
        </>
    )
}

export default PetDetailsPage