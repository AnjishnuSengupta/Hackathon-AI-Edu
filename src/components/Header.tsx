'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import AccessibilitySettings from '@/components/AccessibilitySettings'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md" role="banner">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors" aria-label="Home">
          AI-Edu Platform
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/resources" className="hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">Resources</Link></li>
            {user ? (
              <>
                {user.email?.includes('admin') && (
                  <li><Link href="/admin" className="hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">Admin</Link></li>
                )}
                <li><Link href="/profile" className="hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">Profile</Link></li>
                <li><button onClick={logout} className="hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">Logout</button></li>
              </>
            ) : (
              <li><Link href="/login" className="hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">Login</Link></li>
            )}
          </ul>
        </nav>
        <AccessibilitySettings />
      </div>
    </header>
  )
}

export default Header

