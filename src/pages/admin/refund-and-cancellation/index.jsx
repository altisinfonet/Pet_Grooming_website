import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import RefundAndCancellationPage from '@/admin/Pages/RefundAndCancellation/refundAndCancellation'


const RefundAndCancellation = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <RefundAndCancellationPage />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default RefundAndCancellation