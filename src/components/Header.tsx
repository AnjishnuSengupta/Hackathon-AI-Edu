'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import AccessibilitySettings from './AccessibilitySettings'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 header-text">
          AI-Edu Platform
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/resources" className="nav-link header-text">
            Resources
          </Link>
          {user ? (
            <>
              {user.email?.includes('admin') && (
                <Link href="/admin" className="nav-link header-text">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="nav-link header-text">
                Profile
              </Link>
              <button onClick={logout} className="nav-link header-text">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link header-text">
                Login
              </Link>
              <Link href="/register" className="nav-link header-text">
                Register
              </Link>
            </>
          )}
          <AccessibilitySettings />
        </nav>
      </div>
    </header>
  )
}

export default Header

