'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export default function AdminPage() {
  const { user } = useAuth()
  interface Resource {
    id: string;
    title: string;
    content: string;
    category: string;
    type: string;
  }
  const [resources, setResources] = useState<Resource[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('text')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.email && user.email.includes('admin')) {
      fetchResources()
    }
  }, [user])

  const fetchResources = async () => {
    const resourcesCollection = collection(db, 'resources')
    const resourcesSnapshot = await getDocs(resourcesCollection)
    const resourcesList = resourcesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Resource[]
    setResources(resourcesList)
  }

  interface ResourceData {
    title: string;
    content: string;
    category: string;
    type: string;
    updatedAt?: Date;
    createdAt?: Date;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!user || !user.email || !user.email.includes('admin')) {
        alert('You do not have permission to manage resources')
        return
      }

      try {
        if (editingId) {
          const updateData: Partial<ResourceData> = {
            title,
            content,
            category,
            type,
            updatedAt: new Date()
          }
          await updateDoc(doc(db, 'resources', editingId), updateData)
          setEditingId(null)
        } else {
          const newResource: ResourceData = {
            title,
            content,
            category,
            type,
            createdAt: new Date()
          }
          await addDoc(collection(db, 'resources'), newResource)
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

  const handleEdit = (resource: Resource) => {
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
      } catch (error: unknown) {
        console.error('Error deleting document: ', error)
        alert('Failed to delete resource')
      }
    }
  }

  if (!user || !user.email || !user.email.includes('admin')) {
    return <div>Access denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Resource</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setType(e.target.value)}
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
    </div>
  )
}

