'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import AccessibilitySettings from './AccessibilitySettings'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 space-x-8">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900"
          >
            AI-Edu Platform
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              <Link href="/resources" className="nav-link">
                Resources
              </Link>
              {user ? (
                <>
                  {user.email?.includes('admin') && (
                    <Link href="/admin" className="nav-link">
                      Admin
                    </Link>
                  )}
                  <Link href="/profile" className="nav-link">
                    Profile
                  </Link>
                  <button onClick={logout} className="nav-link">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="nav-link">
                  Login
                </Link>
              )}
            </nav>
            <AccessibilitySettings />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
