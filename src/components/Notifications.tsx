'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: any;
  userId: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      setNotifications(fetchedNotifications)
    })

    return () => unsubscribe()
  }, [user])

const markAsRead = async (notificationId: string): Promise<void> => {
    await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
    })
}

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li 
              key={notification.id} 
              className={`p-2 rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">
                {notification.createdAt.toDate().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
