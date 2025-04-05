import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import Pos from '../../../admin/Pages/Pos'

const PosPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Pos />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default PosPage