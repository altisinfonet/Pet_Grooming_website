import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import CustomerList from '../../../admin/Pages/Customer/list'

const CustomerListPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <CustomerList />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CustomerListPage