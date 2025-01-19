'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const ErrorBoundary = dynamic(() => import('./ErrorBoundary'), { ssr: false })

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

export default ErrorBoundaryWrapper

