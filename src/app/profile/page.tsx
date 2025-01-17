'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [completedResources, setCompletedResources] = useState<string[]>([])

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
      }
    }
  }

  interface UserProfileData {
    name: string;
    bio: string;
    completedResources: string[];
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (user) {
      try {
        const profileData: UserProfileData = {
          name,
          bio,
          completedResources
        };
        await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
        alert('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      }
    }
  };

  interface ResourceCompletionParams {
    resourceId: string;
  }

  const markResourceAsCompleted = async ({ resourceId }: ResourceCompletionParams): Promise<void> => {
    if (user) {
      try {
        const updatedCompletedResources: string[] = [...completedResources, resourceId];
        await updateDoc(doc(db, 'users', user.uid), {
          completedResources: updatedCompletedResources
        });
        setCompletedResources(updatedCompletedResources);
        alert('Resource marked as completed');
      } catch (error: unknown) {
        console.error('Error marking resource as completed:', error);
        alert('Failed to mark resource as completed');
      }
    }
  };

  if (!user) {
    return <div>Please log in to view your profile</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Update Profile
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Completed Resources</h2>
      <ul className="list-disc pl-5">
        {completedResources.map(resourceId => (
          <li key={resourceId}>{resourceId}</li>
        ))}
      </ul>
    </div>
  )
}

