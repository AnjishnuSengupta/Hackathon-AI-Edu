'use client'

import { useState, useEffect } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech = ({ text }: TextToSpeechProps) => {
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
    <div className="mt-4">
      <button 
        onClick={speak}
        className={`px-4 py-2 rounded ${highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'} hover:opacity-80`}
      >
        {speaking ? 'Stop Reading' : 'Read Aloud'}
      </button>
    </div>
  )
}

export default TextToSpeech

