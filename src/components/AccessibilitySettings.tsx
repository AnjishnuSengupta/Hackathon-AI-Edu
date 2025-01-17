'use client'

import { useAccessibility } from '@/context/AccessibilityContext'

const AccessibilitySettings = () => {
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility()

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => setFontSize(fontSize + 1)} 
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Increase font size"
      >
        A+
      </button>
      <button 
        onClick={() => setFontSize(fontSize - 1)} 
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <button 
        onClick={() => setHighContrast(!highContrast)}
        className={`p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'
        }`}
        aria-label="Toggle high contrast mode"
      >
        {highContrast ? 'Normal Contrast' : 'High Contrast'}
      </button>
    </div>
  )
}

export default AccessibilitySettings

