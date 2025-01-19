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

// Function to generate trending educational videos for higher secondary level
const generateTrendingVideos = () => {
  return [
    {
      id: 'trend1',
      title: 'Understanding Quantum Entanglement',
      description: 'Explore the fascinating world of quantum physics and learn about the phenomenon of entanglement.',
      thumbnailUrl: 'https://img.youtube.com/vi/JFozGfxmi8A/default.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=JFozGfxmi8A',
    },
    {
      id: 'trend2',
      title: 'The French Revolution: Causes and Consequences',
      description: 'Delve into the historical events that led to the French Revolution and its impact on modern society.',
      thumbnailUrl: 'https://img.youtube.com/vi/5fJl_ZX91l0/default.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=5fJl_ZX91l0',
    },
    {
      id: 'trend3',
      title: 'Advanced Calculus: Taylor Series Explained',
      description: 'Master the concept of Taylor series and its applications in advanced mathematics.',
      thumbnailUrl: 'https://img.youtube.com/vi/3d6DsjIBzJ4/default.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=3d6DsjIBzJ4',
    },
    {
      id: 'trend4',
      title: 'Shakespeare\'s Macbeth: Character Analysis',
      description: 'An in-depth look at the main characters in Shakespeare\'s tragedy Macbeth.',
      thumbnailUrl: 'https://img.youtube.com/vi/qfnUq2_0FOY/default.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=qfnUq2_0FOY',
    },
    {
      id: 'trend5',
      title: 'Climate Change: The Science and Global Impact',
      description: 'Understand the scientific basis of climate change and its effects on our planet.',
      thumbnailUrl: 'https://img.youtube.com/vi/gUdtcx-6OBE/default.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=gUdtcx-6OBE',
    },
  ]
}

export default function Resources() {
  const [resources, setResources] = useState<{ id: string; title: string; description: string; }[]>([])
  const [filteredResources, setFilteredResources] = useState<{ id: string; title: string; description: string; }[]>([])
  const [trendingVideos, setTrendingVideos] = useState<{ id: string; title: string; description: string; thumbnailUrl: string; videoUrl: string; }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchResources = async () => {
      if (category && category in subjectResources) {
        setResources(subjectResources[category as keyof typeof subjectResources])
      } else {
        const resourcesCollection = collection(db, 'resources')
        const resourcesSnapshot = await getDocs(resourcesCollection)
        const resourcesList = resourcesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as { id: string; title: string; description: string; }[]
        setResources(resourcesList)
      }
      setLoading(false)
    }

    fetchResources()
    setTrendingVideos(generateTrendingVideos())
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

      <h2 className="text-2xl font-bold mb-4">Trending Educational Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {trendingVideos.map(video => (
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" key={video.id} className="block">
            <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow">
              <img src={video.thumbnailUrl || "/placeholder.svg"} alt={video.title} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="text-sm font-semibold">{video.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{video.description}</p>
            </div>
          </a>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Educational Resources</h2>
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

