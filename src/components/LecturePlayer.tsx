'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Lecture {
  source?: 'youtube' | 'khan_academy' | 'vimeo'
  videoId?: string
  url?: string
  type: 'text' | 'image' | 'video'
  title: string
  content?: string
  imageUrl?: string
}

const LecturePlayer = ({ lecture }: { lecture: Lecture }) => {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (lecture.source === 'youtube') {
      setVideoUrl(`https://www.youtube.com/embed/${lecture.videoId}`)
    } else if (lecture.source === 'khan_academy') {
      setVideoUrl(`https://www.khanacademy.org/embed_video?v=${lecture.videoId}`)
    } else if (lecture.source === 'vimeo') {
      setVideoUrl(`https://player.vimeo.com/video/${lecture.videoId}`)
    } else {
      setVideoUrl(lecture.url ?? '')
    }
  }, [lecture])

  if (lecture.type === 'text') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{lecture.title}</h2>
        <div className="prose max-w-none">
          {lecture.content}
        </div>
      </div>
    )
  }

  if (lecture.type === 'image') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{lecture.title}</h2>
        <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
          <Image
            src={lecture.imageUrl || "/placeholder.svg"}
            alt={lecture.title}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={videoUrl}
        title={lecture.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-md"
      ></iframe>
    </div>
  )
}

export default LecturePlayer

