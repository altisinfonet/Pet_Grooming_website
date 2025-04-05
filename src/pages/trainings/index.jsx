import React from 'react'
import Training from '../../client/pages/Training'
import AuthGuard from '../../client/components/common/AuthGuard'

const TrainingPage = () => {
    return (
        <div>
            <AuthGuard><Training /></AuthGuard>
        </div>
    )
}

export default TrainingPage