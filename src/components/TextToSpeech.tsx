'use client'

import { useState, useEffect } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

const TextToSpeech = ({ text }: { text: string }) => {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const { highContrast } = useAccessibility()

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false)
    }
  }, [])

  const speak = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
  }

  if (!supported) {
    return (
      <div className="text-red-600">
        Text-to-speech is not supported in your browser.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button 
        onClick={speak}
        className={`btn ${highContrast ? 'bg-yellow-400 text-black' : 'btn-primary'}`}
      >
        {speaking ? 'Stop Reading' : 'Start Reading'}
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  )
}

export default TextToSpeech

