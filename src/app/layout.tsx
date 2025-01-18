import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { AccessibilityProvider } from '../context/AccessibilityContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Notifications from '../components/Notifications'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'AI-Powered Educational Platform',
  description: 'An accessible educational platform with AI features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          <AccessibilityProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Notifications />
              {children}
            </main>
            <Footer />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

