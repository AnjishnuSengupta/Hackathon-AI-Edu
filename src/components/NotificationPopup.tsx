'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface NotificationPopupProps {
  message: string;
  onDismiss: () => void;
}

const NotificationPopup = ({ message, onDismiss }: NotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-md shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationPopup

