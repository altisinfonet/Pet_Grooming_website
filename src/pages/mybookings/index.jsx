import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import MyBookingNav from '../../client/pages/MyBookingNav'

const MyBookingNavPage = () => {
    return (
        <div>
            <AuthGuard><MyBookingNav /></AuthGuard>
        </div>
    )
}

export default MyBookingNavPage