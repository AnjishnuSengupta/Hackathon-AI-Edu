'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminPage() {
  const { user, userRole } = useAuth()
  const [resources, setResources] = useState<any[]>([])
  const [users, setUsers] = useState<Array<{ id: string; email?: string; name?: string; role?: string; completedResources?: string[]; }>>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<'text' | 'video'>('text')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('resources')

  const [lectures, setLectures] = useState<Lecture[]>([])
  const [lectureTitle, setLectureTitle] = useState('')
  const [lectureCategory, setLectureCategory] = useState('')
  const [lectureType, setLectureType] = useState('video')
  const [lectureSource, setLectureSource] = useState('')
  const [lectureVideoId, setLectureVideoId] = useState('')
  const [lectureUrl, setLectureUrl] = useState('')
  const [lectureContent, setLectureContent] = useState('')
  const [lectureTranscript, setLectureTranscript] = useState('')
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null)

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchResources()
      fetchUsers()
      fetchLectures()
    }
  }, [user, userRole])

  const fetchResources = async () => {
    const resourcesCollection = collection(db, 'resources')
    const resourcesSnapshot = await getDocs(resourcesCollection)
    const resourcesList = resourcesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setResources(resourcesList)
  }

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users')
    const usersSnapshot = await getDocs(usersCollection)
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setUsers(usersList)
  }

  interface Resource {
    id: string;
    title: string;
    content: string;
    category: string;
    type: 'text' | 'video';
  }

  interface ResourceData {
    title: string;
    content: string;
    category: string;
    type: 'text' | 'video';
    updatedAt: Date;
    createdAt?: Date;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || userRole !== 'admin') {
      alert('You do not have permission to manage resources')
      return
    }

    try {
      const resourceData: ResourceData = {
        title,
        content,
        category,
        type,
        updatedAt: new Date()
      }

      if (editingId) {
        await updateDoc(doc(db, 'resources', editingId), {...resourceData} as { [key: string]: any })
        setEditingId(null)
      } else {
        await addDoc(collection(db, 'resources'), {
          ...resourceData,
          createdAt: new Date()
        })
      }
      alert(editingId ? 'Resource updated successfully' : 'Resource added successfully')
      setTitle('')
      setContent('')
      setCategory('')
      setType('text')
      fetchResources()
    } catch (error) {
      console.error('Error managing document: ', error)
      alert('Failed to manage resource')
    }
  }

  const handleEdit = (resource: Resource): void => {
    setTitle(resource.title)
    setContent(resource.content)
    setCategory(resource.category)
    setType(resource.type)
    setEditingId(resource.id)
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteDoc(doc(db, 'resources', id))
        alert('Resource deleted successfully')
        fetchResources()
      } catch (error) {
        console.error('Error deleting document: ', error)
        alert('Failed to delete resource')
      }
    }
  }

  interface DeleteUserResult {
    success: boolean;
    error?: Error;
  }

  const handleDeleteUser = async (id: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        alert('User deleted successfully');
        fetchUsers();
      } catch (error: unknown) {
        console.error('Error deleting user: ', error);
        alert('Failed to delete user');
      }
    }
  };

  const fetchLectures = async () => {
    const lecturesCollection = collection(db, 'lectures')
    const lecturesSnapshot = await getDocs(lecturesCollection)
    const lecturesList = lecturesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lecture[]
    setLectures(lecturesList)
  }

  interface LectureData {
    title: string;
    category: string;
    type: string;
    transcript: string;
    updatedAt: Date;
    source?: string;
    videoId?: string;
    url?: string;
    content?: string;
    createdAt?: Date;
  }

  const handleLectureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!user || userRole !== 'admin') {
        alert('You do not have permission to manage lectures')
        return
      }

      try {
        const lectureData: LectureData = {
          title: lectureTitle,
          category: lectureCategory,
          type: lectureType,
          transcript: lectureTranscript,
          updatedAt: new Date()
        }

        if (lectureType === 'video') {
          lectureData.source = lectureSource
          lectureData.videoId = lectureVideoId
          if (lectureSource === 'custom') {
            lectureData.url = lectureUrl
          }
        } else {
          lectureData.content = lectureContent
        }

        if (editingLectureId) {
          await updateDoc(doc(db, 'lectures', editingLectureId), {...lectureData} as { [key: string]: any })
        } else {
          await addDoc(collection(db, 'lectures'), {
            ...lectureData,
            createdAt: new Date()
          })
        }

        alert(editingLectureId ? 'Lecture updated successfully' : 'Lecture added successfully')
        resetLectureForm()
        fetchLectures()
      } catch (error) {
        console.error('Error managing lecture: ', error)
        alert('Failed to manage lecture')
      }
    }

  interface Lecture {
    id: string;
    title: string;
    category: string;
    type: string;
    transcript: string;
    source?: string;
    videoId?: string;
    url?: string;
    content?: string;
  }

  const handleEditLecture = (lecture: Lecture): void => {
    setLectureTitle(lecture.title)
    setLectureCategory(lecture.category)
    setLectureType(lecture.type)
    setLectureTranscript(lecture.transcript)
    if (lecture.type === 'video') {
      setLectureSource(lecture.source!)
      setLectureVideoId(lecture.videoId!)
      setLectureUrl(lecture.url || '')
    } else {
      setLectureContent(lecture.content!)
    }
    setEditingLectureId(lecture.id)
  }

  interface DeleteLectureResult {
    success: boolean;
    error?: Error;
  }

  const handleDeleteLecture = async (id: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteDoc(doc(db, 'lectures', id));
        alert('Lecture deleted successfully');
        fetchLectures();
      } catch (error: unknown) {
        console.error('Error deleting lecture: ', error);
        alert('Failed to delete lecture');
      }
    }
  };

  const resetLectureForm = () => {
    setLectureTitle('')
    setLectureCategory('')
    setLectureType('video')
    setLectureSource('')
    setLectureVideoId('')
    setLectureUrl('')
    setLectureContent('')
    setLectureTranscript('')
    setEditingLectureId(null)
  }

  if (!user || userRole !== 'admin') {
    return <div className="container mx-auto px-4 py-8">Access denied. You must be an admin to view this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('resources')}
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Manage Resources
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-4 py-2 rounded ${activeTab === 'lectures' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Manage Lectures
        </button>
      </div>

      {activeTab === 'resources' && (
        <>
          <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Resource</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'text' | 'video')}
              className="w-full p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {editingId ? 'Update' : 'Add'} Resource
            </button>
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-4">Manage Resources</h2>
          <div className="space-y-4">
            {resources.map(resource => (
              <div key={resource.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{resource.title}</h3>
                <p>{resource.category} - {resource.type}</p>
                <div className="mt-2">
                  <button onClick={() => handleEdit(resource)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(resource.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{user.name || 'Unnamed User'}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role || 'user'}</p>
                <p>Completed Resources: {user.completedResources?.length || 0}</p>
                <div className="mt-2">
                  <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete User</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'lectures' && (
        <>
          <h2 className="text-2xl font-bold mb-4">{editingLectureId ? 'Edit' : 'Add'} Lecture</h2>
          <form onSubmit={handleLectureSubmit} className="space-y-4 mb-8">
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={lectureCategory}
              onChange={(e) => setLectureCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Literature">Literature</option>
            </select>
            <select
              value={lectureType}
              onChange={(e) => setLectureType(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
            {lectureType === 'video' && (
              <>
                <select
                  value={lectureSource}
                  onChange={(e) => setLectureSource(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Source</option>
                  <option value="youtube">YouTube</option>
                  <option value="khan_academy">Khan Academy</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="custom">Custom URL</option>
                </select>
                {lectureSource === 'custom' ? (
                  <input
                    type="url"
                    value={lectureUrl}
                    onChange={(e) => setLectureUrl(e.target.value)}
                    placeholder="Video URL"
                    className="w-full p-2 border rounded"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={lectureVideoId}
                    onChange={(e) => setLectureVideoId(e.target.value)}
                    placeholder="Video ID"
                    className="w-full p-2 border rounded"
                    required
                  />
                )}
              </>
            )}
            {lectureType === 'text' && (
              <textarea
                value={lectureContent}
                onChange={(e) => setLectureContent(e.target.value)}
                placeholder="Lecture Content"
                className="w-full p-2 border rounded"
                rows={6}
                required
              />
            )}
            <textarea
              value={lectureTranscript}
              onChange={(e) => setLectureTranscript(e.target.value)}
              placeholder="Transcript"
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {editingLectureId ? 'Update' : 'Add'} Lecture
            </button>
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-4">Manage Lectures</h2>
          <div className="space-y-4">
            {lectures.map(lecture => (
              <div key={lecture.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{lecture.title}</h3>
                <p>{lecture.category} - {lecture.type}</p>
                <div className="mt-2">
                  <button onClick={() => handleEditLecture(lecture)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDeleteLecture(lecture.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

