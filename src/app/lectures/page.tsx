'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import BoardSelection from '../../components/BoardSelection'
import LecturePlayer from '../../components/LecturePlayer'

const classRange = Array.from({ length: 12 }, (_, i) => i + 1)

export default function LecturesPage() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [suggestedVideos, setSuggestedVideos] = useState<VideoData[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const boardParam = searchParams.get('board')
    const classParam = searchParams.get('class')
    const subjectParam = searchParams.get('subject')

    if (boardParam) setSelectedBoard(boardParam)
    if (classParam) setSelectedClass(parseInt(classParam))
    if (subjectParam) setSelectedSubject(subjectParam)
  }, [searchParams])

  interface BoardSelectParams {
    board: string;
  }

  const handleBoardSelect = (board: string): void => {
    setSelectedBoard(board);
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedVideo(null);
    updateURL({ board } as BoardSelectParams);
  }

  interface ClassSelectParams {
    class: number;
  }

  const handleClassSelect = (classNum: number): void => {
    setSelectedClass(classNum);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedVideo(null);
    fetchSubjects({ board: selectedBoard, classNum });
    updateURL({ class: classNum } as ClassSelectParams);
  }

  interface SubjectSelectParams {
    subject: string;
  }

  const handleSubjectSelect = (subject: string): void => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setSelectedVideo(null);
    fetchTopics(selectedBoard, selectedClass, subject);
    updateURL({ subject } as SubjectSelectParams);
  }

  interface TopicSelectParams {
    topic: string;
  }

  const handleTopicSelect = (topic: string): void => {
    setSelectedTopic(topic);
    setSelectedVideo(null);
    fetchSuggestedVideos(selectedBoard, selectedClass, selectedSubject, topic);
  }

  interface Video {
    id: string;
    title: string;
    videoId: string;
  }

  const handleVideoSelect = (video: Video): void => {
    setSelectedVideo(video);
  }

  interface FetchSubjectsParams {
    board: string | null;
    classNum: number | null;
  }

  const fetchSubjects = async ({ board, classNum }: FetchSubjectsParams): Promise<void> => {
    setLoading(true);
    try {
      // In a real application, you would make an API call to your backend
      // which would then use Google's Custom Search API to get the results
      // For this example, we'll use mock data
      const mockSubjects: string[] = ['Mathematics', 'Science', 'English', 'Social Studies'];
      setSubjects(mockSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
    setLoading(false);
  };

  interface FetchTopicsParams {
    board: string | null;
    classNum: number | null;
    subject: string | null;
  }

  const fetchTopics = async (board: string | null, classNum: number | null, subject: string | null): Promise<void> => {
    setLoading(true)
    try {
      // In a real application, you would make an API call to your backend
      // which would then use Google's Custom Search API to get the results
      // For this example, we'll use mock data
      const mockTopics: string[] = ['Chapter 1: Introduction', 'Chapter 2: Basic Concepts', 'Chapter 3: Advanced Topics']
      setTopics(mockTopics)
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
    setLoading(false)
  }

  interface VideoData {
    id: string;
    title: string;
    videoId: string;
  }

  interface FetchSuggestedVideosParams {
    board: string | null;
    classNum: number | null;
    subject: string | null;
    topic: string | null;
  }

  const fetchSuggestedVideos = async (
    board: string | null,
    classNum: number | null,
    subject: string | null,
    topic: string | null
  ): Promise<void> => {
    setLoading(true)
    try {
      // In a real application, you would make an API call to your backend
      // which would then use YouTube's API to get the results
      // For this example, we'll use mock data
      const mockVideos: VideoData[] = [
        { id: 'video1', title: 'Introduction to Topic', videoId: 'dQw4w9WgXcQ' },
        { id: 'video2', title: 'Detailed Explanation', videoId: 'dQw4w9WgXcQ' },
        { id: 'video3', title: 'Practice Problems', videoId: 'dQw4w9WgXcQ' }
      ]
      setSuggestedVideos(mockVideos)
    } catch (error) {
      console.error('Error fetching suggested videos:', error)
    }
    setLoading(false)
  }

  interface URLParams extends Partial<BoardSelectParams & ClassSelectParams & SubjectSelectParams & TopicSelectParams> {}

  const updateURL = (params: URLParams) => {
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value.toString())
      } else {
        url.searchParams.delete(key)
      }
    })
    window.history.pushState({}, '', url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Lectures
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!selectedBoard && <BoardSelection onBoardSelect={handleBoardSelect} />}
          {selectedBoard && !selectedClass && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Select Class</h2>
              <div className="grid grid-cols-3 gap-2">
                {classRange.map((classNum) => (
                  <motion.button
                    key={classNum}
                    onClick={() => handleClassSelect(classNum)}
                    className="p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Class {classNum}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          {selectedClass && subjects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 mt-4">Select Subject</h2>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`block w-full text-left p-2 rounded ${
                      selectedSubject === subject ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {subject}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          {selectedSubject && topics.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 mt-4">Select Topic</h2>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <motion.button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className={`block w-full text-left p-2 rounded ${
                      selectedTopic === topic ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {selectedVideo ? (
            <LecturePlayer lecture={selectedVideo} />
          ) : (
            <div className="bg-gray-100 rounded-lg p-4 h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">Select a board, class, subject, and topic to view lectures</p>
            </div>
          )}
          {suggestedVideos.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Suggested Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {suggestedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">{video.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

