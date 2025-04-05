import React from 'react'
import Widgets from '../../../admin/views/widgets/Widgets'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'

const WidgetsPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Widgets />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default WidgetsPage