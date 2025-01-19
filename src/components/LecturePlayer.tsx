'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import TextToSpeech from './TextToSpeech'
import SignLanguageConverter from './SignLanguageConverter'

interface Lecture {
  source?: string;
  videoId?: string;
  url?: string;
  type?: string;
  title: string;
  content?: string;
  imageUrl?: string;
  description?: string;
  transcript?: string;
}

const LecturePlayer = ({ lecture }: { lecture: Lecture }) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [showChatbox, setShowChatbox] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSignLanguageMode, setIsSignLanguageMode] = useState(false)
  const videoRef = useRef(null)

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

  interface Message {
    text: string;
    isUser: boolean;
  }

  const handleSendMessage = (message: string): void => {
    setMessages([...messages, { text: message, isUser: true }]);
    setTimeout(() => {
      setMessages((prev: Message[]) => [...prev, { text: `Echo: ${message}`, isUser: false }]);
    }, 1000);
  };

  const handleSignLanguageInput = (detectedText: string): void => {
    handleSendMessage(detectedText)
  }

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox)
  }

  const toggleInputMode = () => {
    setIsSignLanguageMode(!isSignLanguageMode)
  }

  if (lecture.type === 'text') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{lecture.title}</h2>
        <div className="prose max-w-none mb-4">
          {lecture.content}
        </div>
        <TextToSpeech text={lecture.content ?? 'No content available.'} />
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
        <TextToSpeech text={lecture.description || lecture.title} />
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{lecture.title}</h2>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe
          src={videoUrl}
          title={lecture.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-md"
          ref={videoRef}
        ></iframe>
      </div>
      <TextToSpeech text={lecture.transcript || 'No transcript available.'} />
      <button
        onClick={toggleChatbox}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showChatbox ? 'Hide Chatbox' : 'Show Chatbox'}
      </button>
      {showChatbox && (
        <div className="mt-4 border rounded-lg p-4">
          <div className="h-48 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleInputMode}
              className="mr-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {isSignLanguageMode ? 'Text' : 'Sign Language'}
            </button>
            {isSignLanguageMode ? (
              <SignLanguageConverter onDetectedText={handleSignLanguageInput} />
            ) : (
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(inputMessage)
                    setInputMessage('')
                  }
                }}
                className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your question..."
              />
            )}
            <button
              onClick={() => {
                if (!isSignLanguageMode) {
                  handleSendMessage(inputMessage)
                  setInputMessage('')
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LecturePlayer

