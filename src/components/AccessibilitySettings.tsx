'use client'

import { useAccessibility } from '../context/AccessibilityContext'

const AccessibilitySettings = () => {
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility()

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => setFontSize(fontSize + 1)} 
        className="btn btn-primary"
      >
        A+
      </button>
      <button 
        onClick={() => setFontSize(fontSize - 1)} 
        className="btn btn-primary"
      >
        A-
      </button>
      <button 
        onClick={() => setHighContrast(!highContrast)}
        className={`btn ${highContrast ? 'bg-yellow-400 text-black' : 'btn-primary'}`}
      >
        High Contrast
      </button>
    </div>
  )
}

export default AccessibilitySettings

