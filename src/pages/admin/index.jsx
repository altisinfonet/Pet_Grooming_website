import React from 'react'
import ProtectRoute from '../../ProtectRoute'
import ProtectedInit from '../../protectedInit'

const AdminIndex = () => {
    return (
        <div>
            <ProtectRoute>
                <ProtectedInit />
            </ ProtectRoute>
        </div>
    )
}

export default AdminIndex