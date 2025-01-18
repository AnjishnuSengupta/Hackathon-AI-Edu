'use client'

import { useState } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

type RatingSystemProps = {
  resourceId: string;
  initialRating: number;
  initialVotes: Array<{ userId: string; rating: number }>;
}

const RatingSystem = ({ resourceId, initialRating, initialVotes }: RatingSystemProps) => {
  const [rating, setRating] = useState(initialRating)
  const [votes, setVotes] = useState(initialVotes)
  const { user } = useAuth()

interface Vote {
    userId: string;
    rating: number;
}

const handleRating = async (newRating: number): Promise<void> => {
    if (!user) {
        alert('Please log in to rate this resource')
        return
    }

    const resourceRef = doc(db, 'resources', resourceId)
    const userVote: Vote = { userId: user.uid, rating: newRating }

    try {
        // Remove the user's previous vote if it exists
        await updateDoc(resourceRef, {
            votes: arrayRemove({ userId: user.uid, rating: rating })
        })

        // Add the new vote
        await updateDoc(resourceRef, {
            votes: arrayUnion(userVote)
        })

        // Update local state
        const updatedVotes: Vote[] = votes.filter(vote => vote.userId !== user.uid).concat(userVote)
        setVotes(updatedVotes)
        const newAverageRating: number = updatedVotes.reduce((sum, vote) => sum + vote.rating, 0) / updatedVotes.length
        setRating(newAverageRating)

        alert('Thank you for your rating!')
    } catch (error) {
        console.error('Error updating rating:', error)
        alert('Failed to update rating')
    }
}

  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className={`text-2xl ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
      <span className="text-sm text-gray-500">({votes.length} votes)</span>
    </div>
  )
}

export default RatingSystem

