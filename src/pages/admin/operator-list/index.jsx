import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import ListOperator from '../../../admin/Pages/operator/list'

const ListOperatorPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <ListOperator />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default ListOperatorPage