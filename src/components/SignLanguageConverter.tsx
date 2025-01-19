'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs-backend-webgl'

const SignLanguageConverter = ({ text }: { text: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translating, setTranslating] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [detectedLetter, setDetectedLetter] = useState('')
  const { highContrast } = useAccessibility()

  useEffect(() => {
    if (!translating) return

    let handposeModel
    const startCamera = async () => {
      try {
        handposeModel = await handpose.load()
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          videoRef.current.srcObject = stream
          videoRef.current.play()
          detectHands(handposeModel)
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setCameraError(true)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [translating])

interface HandLandmark {
    landmarks: number[][]
}

interface HandposeModel {
    estimateHands: (input: HTMLVideoElement) => Promise<HandLandmark[]>
}

const detectHands = async (model: HandposeModel): Promise<void> => {
    if (!canvasRef.current || !videoRef.current) return

    const predictions: HandLandmark[] = await model.estimateHands(videoRef.current)
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    if (predictions.length > 0) {
        predictions.forEach((prediction: HandLandmark) => {
            const landmarks: number[][] = prediction.landmarks

            // Draw hand skeleton
            ctx.strokeStyle = highContrast ? 'yellow' : 'blue'
            ctx.lineWidth = 2

            for (let i = 0; i < landmarks.length; i++) {
                const [x, y]: number[] = landmarks[i]
                ctx.beginPath()
                ctx.arc(x, y, 5, 0, 2 * Math.PI)
                ctx.fill()

                if (i > 0) {
                    const [px, py]: number[] = landmarks[i - 1]
                    ctx.moveTo(px, py)
                    ctx.lineTo(x, y)
                    ctx.stroke()
                }
            }

            // Detect letter based on hand pose
            const letter: string = detectLetter(landmarks as Landmarks)
            setDetectedLetter(letter)
        })
    }

    requestAnimationFrame(() => detectHands(model))
}

interface LandmarkCoordinate extends Array<number> {
    0: number;  // x coordinate
    1: number;  // y coordinate
    2: number;  // z coordinate
}

interface Landmarks extends Array<LandmarkCoordinate> {
    [index: number]: LandmarkCoordinate;
}

const detectLetter = (landmarks: Landmarks): string => {
    // This is a simplified example. You would need a more sophisticated algorithm
    // to accurately detect letters based on hand landmarks.
    const thumbTip: LandmarkCoordinate = landmarks[4]
    const indexTip: LandmarkCoordinate = landmarks[8]

    const distance: number = Math.sqrt(
        Math.pow(thumbTip[0] - indexTip[0], 2) + Math.pow(thumbTip[1] - indexTip[1], 2)
    )

    if (distance < 20) {
        return 'A'
    } else if (distance < 40) {
        return 'B'
    } else {
        return 'C'
    }
}

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setTranslating(!translating)}
        className={`btn ${highContrast ? 'bg-yellow-400 text-black' : 'btn-primary'}`}
      >
        {translating ? 'Stop Translation' : 'Start Sign Language Translation'}
      </button>

      {cameraError && (
        <div className="text-red-600">
          Error accessing camera. Please make sure you have granted camera permissions.
        </div>
      )}

      {translating && (
        <div className="relative aspect-video max-w-2xl mx-auto">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full"
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
          />
          <div className="absolute top-4 left-4 bg-white p-2 rounded">
            Detected Letter: {detectedLetter}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded max-h-60 overflow-y-auto">
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  )
}

export default SignLanguageConverter

