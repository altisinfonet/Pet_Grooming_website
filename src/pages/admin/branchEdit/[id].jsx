import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import BranchEdit from '../../../admin/Pages/BranchCreate/BranchEdit'

const BranchEditPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <BranchEdit />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BranchEditPage