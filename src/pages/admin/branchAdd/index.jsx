import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import BranchAdd from '../../../admin/Pages/BranchCreate/BranchCreate'

const BranchAddPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <BranchAdd />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BranchAddPage