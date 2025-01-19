'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

type AuthContextType = {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  grantTemporaryAdminAccess: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  grantTemporaryAdminAccess: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date(),
      completedResources: [],
      preferences: []
    })
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const grantTemporaryAdminAccess = () => {
    if (user) {
      const tempAdminUser = { ...user, email: user.email + '.admin' }
      setUser(tempAdminUser)
      console.log('Temporary admin access granted')
      setTimeout(() => {
        setUser(user)
        console.log('Temporary admin access revoked')
      }, 30 * 60 * 1000)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, grantTemporaryAdminAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

