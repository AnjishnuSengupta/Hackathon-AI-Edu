'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const subjectResources = {
  Math: [
    { id: 'math1', title: 'Introduction to Calculus', description: 'Learn the basics of calculus, including limits, derivatives, and integrals.' },
    { id: 'math2', title: 'Linear Algebra Fundamentals', description: 'Explore vectors, matrices, and linear transformations.' },
    { id: 'math3', title: 'Statistics and Probability', description: 'Understand data analysis, probability distributions, and hypothesis testing.' },
  ],
  Science: [
    { id: 'science1', title: 'Quantum Mechanics', description: 'Dive into the strange world of quantum physics and its applications.' },
    { id: 'science2', title: 'Molecular Biology', description: 'Explore the structure and function of DNA, RNA, and proteins.' },
    { id: 'science3', title: 'Environmental Science', description: 'Learn about ecosystems, climate change, and sustainability.' },
  ],
  Literature: [
    { id: 'lit1', title: 'Shakespeare\'s Plays', description: 'Analyze the themes and characters in Shakespeare\'s most famous works.' },
    { id: 'lit2', title: 'Modern Poetry', description: 'Explore the styles and themes of 20th and 21st century poets.' },
    { id: 'lit3', title: 'World Literature', description: 'Discover great works from various cultures and time periods.' },
  ],
}

interface Resource {
  id: string;
  title: string;
  description: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchResources = async () => {
      if (category && category in subjectResources && (category === 'Math' || category === 'Science' || category === 'Literature')) {
        setResources(subjectResources[category as keyof typeof subjectResources])
      } else {
        const resourcesCollection = collection(db, 'resources')
        const resourcesSnapshot = await getDocs(resourcesCollection)
        const resourcesList = resourcesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resource[]
        setResources(resourcesList)
      }
      setLoading(false)
    }

    fetchResources()
  }, [category])

  useEffect(() => {
    const filtered = resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredResources(filtered)
  }, [searchTerm, resources])

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category || 'All'} Resources</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <Link href={`/resources/${resource.id}`} key={resource.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {filteredResources.length === 0 && (
        <p className="text-center text-gray-600 mt-6">No resources found matching your search.</p>
      )}
    </div>
  )
}

