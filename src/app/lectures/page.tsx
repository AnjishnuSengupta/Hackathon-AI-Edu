'use client'

interface Lecture {
  title: string
  category: string
  type: 'video' | 'text' | 'image'
  transcript?: string
  source?: 'youtube' | 'khan_academy' | 'vimeo'
  videoId?: string
  url?: string
  content?: string
  imageUrl?: string
  createdAt: Date
}

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import LecturePlayer from '../../components/LecturePlayer'
import TextToSpeech from '../../components/TextToSpeech'
import SignLanguageConverter from '../../components/SignLanguageConverter'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

const LECTURES_PER_PAGE = 10

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Array<Lecture & { id: string }>>([])
  const [selectedLecture, setSelectedLecture] = useState<(Lecture & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    fetchLectures()
  }, [category])

  const fetchLectures = async (loadMore = false) => {
    setLoading(true)
    const lecturesRef = collection(db, 'lectures')
    let lecturesQuery = query(lecturesRef)
    
    if (category) {
      lecturesQuery = query(lecturesRef, where('category', '==', category))
    }
    
    lecturesQuery = query(
      category ? lecturesQuery : lecturesRef,
      orderBy('createdAt', 'desc'),
      limit(LECTURES_PER_PAGE)
    )
    
    if (loadMore && lastVisible) {
      lecturesQuery = query(lecturesQuery, startAfter(lastVisible))
    } else {
      setLectures([])
    }

    const lecturesSnapshot = await getDocs(lecturesQuery)
    const lecturesList = lecturesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Lecture & { id: string }))

    setLectures(prev => loadMore ? [...prev, ...lecturesList] : lecturesList)
    setLastVisible(lecturesSnapshot.docs[lecturesSnapshot.docs.length - 1])
    setHasMore(lecturesList.length === LECTURES_PER_PAGE)
    
    if (!loadMore && lecturesList.length > 0) {
      setSelectedLecture(lecturesList[0])
    }
    
    setLoading(false)
  }

  const loadMore = () => {
    if (hasMore) {
      fetchLectures(true)
    }
  }

  if (loading && lectures.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {category ? `${category} Lectures` : 'All Lectures'}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedLecture && (
            <LecturePlayer lecture={selectedLecture} />
          )}
        </motion.div>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-2">Lecture List</h2>
          {lectures.length === 0 ? (
            <p>No lectures found for this category.</p>
          ) : (
            <>
              {lectures.map(lecture => (
                <button
                  key={lecture.id}
                  onClick={() => setSelectedLecture(lecture)}
                  className={`block w-full text-left p-2 rounded ${
                    selectedLecture && selectedLecture.id === lecture.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {lecture.title}
                </button>
              ))}
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </motion.div>
      </div>
      {selectedLecture && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-2">Text-to-Speech</h2>
            <TextToSpeech text={selectedLecture.transcript || 'No transcript available.'} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-2">Sign Language Converter</h2>
            <SignLanguageConverter text={selectedLecture.transcript || 'No transcript available.'} />
          </motion.div>
        </div>
      )}
    </div>
  )
}

