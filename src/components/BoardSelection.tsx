'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BoardSelectionProps {
  onBoardSelect: (board: string) => void;
}

const BoardSelection = ({ onBoardSelect }: BoardSelectionProps) => {
  const [boards, setBoards] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        // In a real application, you would make an API call to your backend
        // which would then use Google's Custom Search API to get the results
        // For this example, we'll use mock data
        const mockBoards = [
          'CBSE', 'ICSE', 'State Board (Maharashtra)', 'State Board (Karnataka)',
          'State Board (Tamil Nadu)', 'International Baccalaureate'
        ]
        setBoards(mockBoards)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching boards:', error)
        setLoading(false)
      }
    }

    fetchBoards()
  }, [])

  if (loading) {
    return <div>Loading boards...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2">Select Board</h2>
      <div className="grid grid-cols-2 gap-2">
        {boards.map((board) => (
          <motion.button
            key={board}
            onClick={() => onBoardSelect(board)}
            className="p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {board}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default BoardSelection

