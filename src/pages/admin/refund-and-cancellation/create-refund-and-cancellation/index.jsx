import React from 'react'
import ProtectRoute from '../../../../ProtectRoute'
import DefaultLayout from '../../../../admin/layout/DefaultLayout'
import CreateRefuncAndCancellation from '@/admin/Pages/RefundAndCancellation/CreateRefuncAndCancellation/createRefuncAndCancellation'

const CreateRefuncAndCancellationPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <CreateRefuncAndCancellation />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default CreateRefuncAndCancellationPage