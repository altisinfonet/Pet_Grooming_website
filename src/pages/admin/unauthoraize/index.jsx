import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import Page500 from '../../../admin/views/pages/page500/Page500'

const Page500Page = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <Page500 />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default Page500Page