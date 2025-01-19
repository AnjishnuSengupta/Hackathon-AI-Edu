'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

type UserRole = 'user' | 'admin'

type AuthContextType = {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  grantTemporaryAdminAccess: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  grantTemporaryAdminAccess: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        setUserRole(userData?.role || 'user')
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'user',
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
      setUserRole('admin')
      console.log('Temporary admin access granted')
      setTimeout(() => {
        setUser(user)
        setUserRole('user')
        console.log('Temporary admin access revoked')
      }, 30 * 60 * 1000)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, register, login, logout, grantTemporaryAdminAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

