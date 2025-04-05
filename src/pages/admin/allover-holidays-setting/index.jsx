import React from 'react'
// import AlloverHolyDays from '../../../admin/Pages/holydays/alloverHolyDays-notapproved'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import ProtectRoute from '../../../ProtectRoute'
import OverallHolyDays from '@/admin/Pages/holydays/alloverHolyDays'


const AlloverHolyDaysPage = () => {

    return (
        <ProtectRoute>

            <DefaultLayout>
                <OverallHolyDays />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default AlloverHolyDaysPage