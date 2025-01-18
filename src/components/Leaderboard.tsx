'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const Leaderboard = () => {
  interface User {
    id: string;
    name?: string;
    completedResources?: string[];
  }
  
  const [leaderboard, setLeaderboard] = useState<User[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(
        collection(db, 'users'),
        orderBy('completedResources', 'desc'),
        limit(10)
      )

      const querySnapshot = await getDocs(q)
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setLeaderboard(leaderboardData)
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="px-6 py-4 flex items-center">
              <span className="text-lg font-semibold mr-4">{index + 1}.</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">
                  Completed Resources: {user.completedResources?.length || 0}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Leaderboard

