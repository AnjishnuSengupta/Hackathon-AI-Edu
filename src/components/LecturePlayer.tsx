'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import TextToSpeech from './TextToSpeech'
import SignLanguageConverter from './SignLanguageConverter'

interface Lecture {
  videoId?: string;
  url?: string;
  title: string;
  transcript?: string;
}

const LecturePlayer = ({ lecture }: { lecture: Lecture }) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [showChatbox, setShowChatbox] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSignLanguageMode, setIsSignLanguageMode] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (lecture.videoId) {
      setVideoUrl(`https://www.youtube.com/embed/${lecture.videoId}`)
    } else {
      setVideoUrl(lecture.url || '')
    }
  }, [lecture])

  interface Message {
    text: string;
    isUser: boolean;
  }

  const handleSendMessage = (message: string): void => {
    setMessages([...messages, { text: message, isUser: true }])
    // Here you would typically send the message to a backend for processing
    // For now, we'll just echo the message back
    setTimeout(() => {
      setMessages((prev: Message[]) => [...prev, { text: `Echo: ${message}`, isUser: false }])
    }, 1000)
  }

  const handleSignLanguageInput = (detectedText: string): void => {
    handleSendMessage(detectedText)
  }

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox)
  }

  const toggleInputMode = async () => {
    if (!isSignLanguageMode && !hasCameraPermission) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true })
        setHasCameraPermission(true)
      } catch (error) {
        console.error('Error accessing camera:', error)
        alert('Camera permission is required for sign language mode. Please enable camera access and try again.')
        return
      }
    }
    setIsSignLanguageMode(!isSignLanguageMode)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{lecture.title}</h2>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={videoUrl}
          title={lecture.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
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

