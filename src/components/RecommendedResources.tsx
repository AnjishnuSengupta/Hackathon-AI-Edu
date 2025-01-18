'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../firebase'
import Link from 'next/link'

const RecommendedResources = ({ userPreferences, completedResources }: { userPreferences: string[], completedResources: string[] }) => {
  const [recommendations, setRecommendations] = useState<Array<{ id: string; title: string; category: string }>>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userPreferences.length === 0) return

      const resourcesRef = collection(db, 'resources')
      const q = query(
        resourcesRef,
        where('category', 'in', userPreferences),
        limit(5)
      )

      const querySnapshot = await getDocs(q)
      const recommendedResources = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as { id: string; title: string; category: string }))
        .filter(resource => !completedResources.includes(resource.id))

      setRecommendations(recommendedResources)
    }

    fetchRecommendations()
  }, [userPreferences, completedResources])

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(resource => (
          <Link href={`/resources/${resource.id}`} key={resource.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecommendedResources
