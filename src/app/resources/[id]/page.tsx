'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import TextToSpeech from '../../../components/TextToSpeech'
import SignLanguageTranslator from '../../../components/SignLanguageTranslator'
import { useAccessibility } from '../../../context/AccessibilityContext'

interface Resource {
  id: string;
  title: string;
  content: string;
  type?: string;
  url?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ResourcePage({ params }: PageProps) {
  const { user } = useAuth()
  const { highContrast } = useAccessibility()
  const [resource, setResource] = useState<Resource | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState('content') // 'content', 'speech', or 'sign'

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
      } catch (error) {
        console.error('Error marking resource as completed:', error)
      }
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (!resource) return <div className="container mx-auto px-4 py-8">Resource not found</div>

  return (
    <div className={`min-h-screen py-8 ${highContrast ? 'high-contrast' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">{resource.title}</h1>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 space-x-4 border-b">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('speech')}
            className={`py-2 px-4 ${activeTab === 'speech' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Text to Speech
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`py-2 px-4 ${activeTab === 'sign' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Sign Language
          </button>
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'content' && (
            <div className="prose max-w-none">
              <p className="text-lg">{resource.content}</p>
              {resource.type === 'video' && (
                <video controls className="w-full mt-4 rounded">
                  <source src={resource.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {activeTab === 'speech' && (
            <div className="p-4 bg-gray-50 rounded">
              <TextToSpeech text={resource.content} />
            </div>
          )}

          {activeTab === 'sign' && (
            <div className="p-4 bg-gray-50 rounded">
              <SignLanguageTranslator />
            </div>
          )}
        </div>

        {/* Progress Tracking */}
        {user && !completed && (
          <button 
            onClick={markAsCompleted}
            className="mt-6 btn btn-primary"
          >
            Mark as Completed
          </button>
        )}
        {completed && (
          <p className="mt-6 text-green-600 font-bold">
            ✓ You have completed this resource!
          </p>
        )}
      </div>
    </div>
  )
}

