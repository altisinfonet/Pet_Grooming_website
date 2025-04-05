import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import TermsAndConditionsComponent from '../../../admin/components/termsAndConditionsComponent'

const TermsAndConditionsComponentPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <TermsAndConditionsComponent />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default TermsAndConditionsComponentPage