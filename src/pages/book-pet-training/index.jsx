import React from 'react'
import AuthGuard from '../../client/components/common/AuthGuard'
import BookPetTraining from '../../client/pages/BookPetTraining'

const BookPetTrainingPage = () => {
    return (
        <div>
            <AuthGuard><BookPetTraining /></AuthGuard>
        </div>
    )
}

export default BookPetTrainingPage