'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type AccessibilityContextType = {
  fontSize: number
  setFontSize: (size: number) => void
  highContrast: boolean
  setHighContrast: (contrast: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  fontSize: 16,
  setFontSize: () => {},
  highContrast: false,
  setHighContrast: () => {},
})

export const useAccessibility = () => useContext(AccessibilityContext)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    document.body.classList.toggle('high-contrast', highContrast)
  }, [fontSize, highContrast])

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

