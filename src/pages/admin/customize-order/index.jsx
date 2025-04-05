import DefaultLayout from '@/admin/layout/DefaultLayout'
import CustomizeService from '@/admin/Pages/OrderBooking/customizeBooking'
import ProtectRoute from '@/ProtectRoute'
import React from 'react'

const CustomizeOrderBookingPage = () => {
    return (
        <div>
            <ProtectRoute>
                <DefaultLayout>
                    <CustomizeService />
                </DefaultLayout>
            </ProtectRoute>
        </div>
    )
}

export default CustomizeOrderBookingPage