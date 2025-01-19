'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, grantTemporaryAdminAccess } = useAuth()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [completedResources, setCompletedResources] = useState([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['Math', 'Science', 'Literature', 'History', 'Technology']

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setName(userData.name || '')
        setBio(userData.bio || '')
        setCompletedResources(userData.completedResources || [])
        setPreferences(userData.preferences || [])
      }
      setLoading(false)
    }
  }

  interface UserProfile {
    name: string;
    bio: string;
    completedResources: string[];
    preferences: string[];
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (user) {
        try {
          const profileData: UserProfile = {
            name,
            bio,
            completedResources,
            preferences
          };
          await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
          alert('Profile updated successfully');
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile');
        }
      }
    };

  const handlePreferenceChange = (category: string): void => {
    setPreferences((prev: string[]) => 
      prev.includes(category) 
        ? prev.filter((p: string) => p !== category)
        : [...prev, category]
    )
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Please log in to view your profile</div>
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferences</label>
          <div className="mt-2 space-y-2">
            {categories.map(category => (
              <label key={category} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={preferences.includes(category)}
                  onChange={() => handlePreferenceChange(category)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Completed Resources</h2>
      {completedResources.length > 0 ? (
        <ul className="space-y-2">
          {completedResources.map(resourceId => (
            <li key={resourceId} className="bg-gray-100 p-3 rounded">
              <Link href={`/resources/${resourceId}`} className="text-blue-600 hover:underline">
                {resourceId}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't completed any resources yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Progress</h2>
      <div className="bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-4 rounded-full" 
          style={{ width: `${(completedResources.length / 10) * 100}%` }}
        ></div>
      </div>
      <p className="mt-2">You've completed {completedResources.length} out of 10 resources.</p>
      <button
        onClick={() => grantTemporaryAdminAccess()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Grant Temporary Admin Access (30 minutes)
      </button>
    </div>
  )
}

