import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import BranchList from '../../../admin/Pages/BranchList/BranchList'

const BranchListPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <BranchList />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BranchListPage