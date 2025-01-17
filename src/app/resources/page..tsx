'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import ResourceCard from '@/components/ResourceCard'
import { useSearchParams } from 'next/navigation'

interface Resource {
  id: string;
  title: string;
  category: string;
  type: string;
  [key: string]: any;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchResources = async () => {
      const resourcesCollection = collection(db, 'resources')
      const resourcesQuery = category 
        ? query(resourcesCollection, where('category', '==', category))
        : resourcesCollection
      const resourcesSnapshot = await getDocs(resourcesQuery)
      const resourcesList = resourcesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[]
      setResources(resourcesList)
      setLoading(false)
    }

    fetchResources()
  }, [category])

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Educational Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

