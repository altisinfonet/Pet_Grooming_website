import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import MyAddress from '../../client/pages/MyAddress'

const MyAddressPage = () => {
    return (
        <div>
            <AuthGuard><MyAddress /></AuthGuard>
        </div>
    )
}

export default MyAddressPage