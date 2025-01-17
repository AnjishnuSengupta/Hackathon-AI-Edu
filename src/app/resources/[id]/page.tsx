'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import TextToSpeech from '@/components/TextToSpeech'
import SignLanguageTranslator from '@/components/SignLanguageTranslator'

interface PageParams {
  id: string;
}

interface Resource {
  id: string;
  title: string;
  content: string;
  type?: string;
  url?: string;
}

export default function ResourcePage({ params }: { params: PageParams }) {
  const { user } = useAuth()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchResource = async () => {
      const docRef = doc(db, 'resources', params.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setResource({ id: docSnap.id, ...docSnap.data() } as Resource)
      }
      setLoading(false)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setCompleted(userData.completedResources?.includes(params.id) || false)
        }
      }
    }

    fetchResource()
  }, [params.id, user])

  const markAsCompleted = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        await updateDoc(userRef, {
          completedResources: [...(userData?.completedResources || []), params.id]
        })
        setCompleted(true)
        alert('Resource marked as completed')
      } catch (error) {
        console.error('Error marking resource as completed:', error)
        alert('Failed to mark resource as completed')
      }
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (!resource) return <div className="container mx-auto px-4 py-8">Resource not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
      <p className="mb-4 text-gray-700">{resource.content}</p>
      <div className="flex flex-col space-y-4 mt-4">
        <TextToSpeech text={resource.content} />
        <SignLanguageTranslator />
      </div>
      {resource.type === 'video' && (
        <video controls className="w-full mt-4 rounded-lg shadow-lg">
          <source src={resource.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {user && !completed && (
        <button 
          onClick={markAsCompleted} 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Mark as Completed
        </button>
      )}
      {completed && (
        <p className="mt-4 text-green-500 font-bold">You have completed this resource!</p>
      )}
    </div>
  )
}

