import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import OrderPage from '../../client/pages/order'

const Order = () => {
    return (
        <div>
            <AuthGuard ><OrderPage /></AuthGuard>
        </div>
    )
}

export default Order