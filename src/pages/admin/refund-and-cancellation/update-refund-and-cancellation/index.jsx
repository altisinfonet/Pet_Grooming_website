import React from 'react'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'
import UpdateRefuncAndCancellation from '@/admin/Pages/RefundAndCancellation/UpdateRefuncAndCancellation/updateRefuncAndCancellation'

const UpdateRefuncAndCancellationPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <UpdateRefuncAndCancellation />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default UpdateRefuncAndCancellationPage