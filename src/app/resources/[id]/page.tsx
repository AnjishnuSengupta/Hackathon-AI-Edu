'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import TextToSpeech from '../../../components/TextToSpeech';
import { User } from 'firebase/auth';
import CommentSection from '../../../components/CommentSection';
import RecommendedResources from '../../../components/RecommendedResources';

interface CustomUser extends User {
  completedResources?: string[];
  preferences?: string[];
}
import SignLanguageTranslator from '../../../components/SignLanguageTranslator';
import RatingSystem from '../../../components/RatingSystem';
const { user } = useAuth() as { user: CustomUser | null };
const { highContrast } = useAccessibility();
import { useAccessibility } from '../../../context/AccessibilityContext';

export default function ResourcePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const { highContrast } = useAccessibility();
  interface Resource {
    id: string;
    title: string;
    content: string;
    type?: string;
    url?: string;
    rating: number;
    votes: Array<{ userId: string; rating: number }>;
  }
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchResource = async () => {
      const docRef = doc(db, 'resources', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const resourceData = docSnap.data();
        interface Vote {
          userId: string;
          rating: number;
        }

        interface ResourceData {
          votes?: Vote[];
          [key: string]: any; // for other potential fields in resourceData
        }

        setResource({
          id: docSnap.id,
          title: resourceData.title,
          content: resourceData.content,
          type: resourceData.type,
          url: resourceData.url,
          ...(resourceData as ResourceData),
          rating: resourceData.votes
            ? resourceData.votes.reduce(
                (sum: number, vote: Vote) => sum + vote.rating,
                0,
              ) / resourceData.votes.length
            : 0,
          votes: (resourceData.votes || []) as Vote[],
        });
      }
      setLoading(false);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCompleted(
            userData.completedResources?.includes(params.id) || false,
          );
        }
      }
    };

    fetchResource();
  }, [params.id, user]);

  const markAsCompleted = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const customUser = user as CustomUser;
        await updateDoc(userRef, {
          completedResources: [
            ...(customUser.completedResources || []),
            params.id,
          ],
        });
        setCompleted(true);
      } catch (error) {
        console.error('Error marking resource as completed:', error);
      }
    }
  };

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!resource)
    return (
      <div className="container mx-auto px-4 py-8">Resource not found</div>
    );

  return (
    <div className={`min-h-screen py-8 ${highContrast ? 'high-contrast' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">{resource.title}</h1>

        <RatingSystem
          resourceId={resource.id}
          initialRating={resource.rating}
          initialVotes={resource.votes}
        />

        <div className="flex flex-wrap mb-6 space-x-4 border-b">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('speech')}
            className={`py-2 px-4 ${activeTab === 'speech' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Text to Speech
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`py-2 px-4 ${activeTab === 'sign' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Sign Language
          </button>
        </div>

        <div className="card">
          {activeTab === 'content' && (
            <div className="prose max-w-none">
              <p className="text-lg">{resource.content}</p>
              {resource.type === 'video' && (
                <video controls className="w-full mt-4 rounded">
                  <source src={resource.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {activeTab === 'speech' && (
            <div className="p-4 bg-gray-50 rounded">
              <TextToSpeech text={resource.content} />
            </div>
          )}

          {activeTab === 'sign' && (
            <div className="p-4 bg-gray-50 rounded">
              <SignLanguageTranslator />
            </div>
          )}
        </div>

        {user && !completed && (
          <button onClick={markAsCompleted} className="mt-6 btn btn-primary">
            Mark as Completed
          </button>
        )}
        {completed && (
          <p className="mt-6 text-green-600 font-bold">
            ✓ You have completed this resource!
          </p>
        )}

        <CommentSection resourceId={resource.id} />

        <RecommendedResources
          userPreferences={(user as CustomUser).preferences || []}
          completedResources={(user as CustomUser).completedResources || []}
        />
      </div>
    </div>
  );
}
