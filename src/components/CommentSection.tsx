'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  resourceId: string;
  createdAt: any;
}

const CommentSection = ({ resourceId }: { resourceId: string }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('resourceId', '==', resourceId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[]
      setComments(fetchedComments)
    })

    return () => unsubscribe()
  }, [resourceId])



interface CommentData {
    content: string;
    userId: string;
    userName: string;
    resourceId: string;
    createdAt: Date;
}

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        if (!user) {
            alert('Please log in to comment')
            return
        }
        if (newComment.trim() === '') return

        try {
            await addDoc(collection(db, 'comments'), {
                content: newComment,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                resourceId,
                createdAt: new Date()
            } as CommentData)
            setNewComment('')
        } catch (error) {
            console.error('Error adding comment: ', error)
        }
    }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Discussion</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="border p-4 rounded">
            <p className="font-semibold">{comment.userName}</p>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500">
              {comment.createdAt.toDate().toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection

