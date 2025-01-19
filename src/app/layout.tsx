import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { AccessibilityProvider } from '../context/AccessibilityContext'
import { metadata } from './metadata'
import LayoutWrapper from '../components/LayoutWrapper'
import ErrorBoundaryWrapper from '../components/ErrorBoundaryWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
    <body className="flex flex-col min-h-screen bg-gray-50">
    <ErrorBoundaryWrapper>
    <AuthProvider>
    <AccessibilityProvider>
    <LayoutWrapper>
    {children}
    </LayoutWrapper>
    </AccessibilityProvider>
    </AuthProvider>
    </ErrorBoundaryWrapper>
    </body>
    </html>
  )
}

