'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import LecturePlayer from '../../components/LecturePlayer'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

const LECTURES_PER_PAGE = 10

const classSubjects: { [key: number]: string[] } = {
  1: ['English', 'Mathematics', 'Environmental Studies'],
  2: ['English', 'Mathematics', 'Environmental Studies'],
  3: ['English', 'Mathematics', 'Environmental Studies'],
  4: ['English', 'Mathematics', 'Environmental Studies', 'Science'],
  5: ['English', 'Mathematics', 'Environmental Studies', 'Science'],
  6: ['English', 'Mathematics', 'Science', 'Social Studies'],
  7: ['English', 'Mathematics', 'Science', 'Social Studies'],
  8: ['English', 'Mathematics', 'Science', 'Social Studies'],
  9: ['English', 'Mathematics', 'Science', 'Social Studies'],
  10: ['English', 'Mathematics', 'Science', 'Social Studies'],
  11: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
  12: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  class: number;
  subject: string;
  type: 'video';
  source: 'youtube';
  videoId: string;
  transcript: string;
}

// Function to generate sample lectures for each class and subject
const generateSampleLectures = () => {

  const lectures: Lecture[] = [];
  for (let classNum = 1; classNum <= 12; classNum++) {
    const subjects = classSubjects[classNum]
    subjects.forEach(subject => {
      lectures.push({
        id: `${classNum}-${subject.toLowerCase().replace(' ', '-')}`,
        title: `${subject} for Class ${classNum}`,
        description: `An introduction to ${subject} concepts for Class ${classNum} students.`,
        class: classNum,
        subject: subject,
        type: 'video',
        source: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video IDs
        transcript: `This is a sample transcript for the ${subject} lecture for Class ${classNum}.`
      })
    })
  }
  return lectures
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const classParam = searchParams.get('class')
  const subjectParam = searchParams.get('subject')

  useEffect(() => {
    fetchLectures()
  }, [classParam, subjectParam])

  const fetchLectures = async () => {
    setLoading(true)
    // In a real application, you would fetch this data from your Firestore database
    // For this example, we'll use our generated sample lectures
    const allLectures = generateSampleLectures()
    let filteredLectures = allLectures

    if (classParam) {
      filteredLectures = filteredLectures.filter(lecture => lecture.class === parseInt(classParam))
      setSelectedClass(parseInt(classParam))
    }

    if (subjectParam) {
      filteredLectures = filteredLectures.filter(lecture => lecture.subject.toLowerCase() === subjectParam.toLowerCase())
      setSelectedSubject(subjectParam)
    }

    setLectures(filteredLectures)
    if (filteredLectures.length > 0) {
      setSelectedLecture(filteredLectures[0])
    }
    setLoading(false)
  }

  interface UrlParams {
    class: string;
    subject: string | null;
  }

  const handleClassChange = (classNum: number): void => {
    setSelectedClass(classNum);
    setSelectedSubject(null);
    // Update URL parameters
    const url = new URL(window.location.href);
    url.searchParams.set('class', classNum.toString());
    url.searchParams.delete('subject');
    window.history.pushState({}, '', url);
    fetchLectures();
  };

  interface SubjectChangeHandler {
    (subject: string): void;
  }

  const handleSubjectChange: SubjectChangeHandler = (subject) => {
    setSelectedSubject(subject);
    // Update URL parameters
    const url = new URL(window.location.href);
    url.searchParams.set('subject', subject);
    window.history.pushState({}, '', url);
    fetchLectures();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
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
          <h2 className="text-xl font-semibold mb-2">Select Class</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.keys(classSubjects).map(classNum => (
              <button
                key={classNum}
                onClick={() => handleClassChange(parseInt(classNum))}
                className={`p-2 rounded ${selectedClass === parseInt(classNum) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Class {classNum}
              </button>
            ))}
          </div>
          {selectedClass && (
            <>
              <h2 className="text-xl font-semibold mb-2">Select Subject</h2>
              <div className="space-y-2">
                {classSubjects[selectedClass].map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectChange(subject)}
                    className={`block w-full text-left p-2 rounded ${selectedSubject === subject ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {selectedLecture && (
            <LecturePlayer lecture={selectedLecture} />
          )}
        </motion.div>
      </div>
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Available Lectures</h2>
        {lectures.length === 0 ? (
          <p>No lectures found for the selected class and subject.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lectures.map(lecture => (
              <button
                key={lecture.id}
                onClick={() => setSelectedLecture(lecture)}
                className={`block w-full text-left p-4 rounded ${
                  selectedLecture && selectedLecture.id === lecture.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <h3 className="font-semibold">{lecture.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{lecture.description}</p>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

