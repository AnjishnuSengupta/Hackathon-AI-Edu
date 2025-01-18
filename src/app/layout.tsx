import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { AccessibilityProvider } from '../context/AccessibilityContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <AccessibilityProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

