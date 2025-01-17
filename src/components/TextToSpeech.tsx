'use client'

import { useState, useEffect } from 'react'

const TextToSpeech = ({ text }: { text: string }) => {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.log("Text-to-speech not supported")
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
    return <p>Text-to-speech is not supported in your browser.</p>
  }

  return (
    <button 
      onClick={speak} 
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      {speaking ? 'Stop' : 'Read Aloud'}
    </button>
  )
}

export default TextToSpeech

