'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Math',
    description: 'Explore our math resources and lectures to enhance your knowledge.',
    href: '/lectures?category=Math'
  },
  {
    title: 'Science',
    description: 'Discover fascinating science topics through our curated lectures.',
    href: '/lectures?category=Science'
  },
  {
    title: 'Literature',
    description: 'Dive into the world of literature with our engaging lectures.',
    href: '/lectures?category=Literature'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Welcome to AI-Edu Platform
          </h1>
          <p className="text-xl text-gray-600">
            Accessible education powered by AI
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link
                href={category.href}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h2>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

