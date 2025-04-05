import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import ListStore from '../../../admin/Pages/store/list'

const listStorePage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <ListStore />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default listStorePage