import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AccessibilityProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow" role="main">
                {children}
              </main>
              <Footer />
            </div>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

