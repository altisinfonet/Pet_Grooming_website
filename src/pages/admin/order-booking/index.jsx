import React from 'react'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import OrderBooking from '../../../admin/Pages/OrderBooking/orderBooking'

const OrderBookingPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <OrderBooking />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default OrderBookingPage