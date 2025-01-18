'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import * as Hands from '@mediapipe/hands'
import * as DrawingUtils from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'

const SignLanguageTranslator = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translating, setTranslating] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const { highContrast } = useAccessibility()

  useEffect(() => {
    if (!translating) return

    let camera: Camera | null = null
    const startCamera = async () => {
      try {
        const hands = new Hands.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          }
        })

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        hands.onResults(onResults)

        if (videoRef.current) {
          camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                await hands.send({image: videoRef.current})
              }
            },
            width: 640,
            height: 480
          })
          await camera.start()
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setCameraError(true)
      }
    }

    startCamera()

    return () => {
      if (camera) {
        camera.stop()
      }
    }
  }, [translating])

  interface HandLandmarks {
    x: number;
    y: number;
    z: number;
  }

  interface HandResults {
    image: CanvasImageSource;
    multiHandLandmarks?: HandLandmarks[][];
  }

  const onResults = (results: HandResults): void => {
    if (!canvasRef.current) return

    const canvasCtx: CanvasRenderingContext2D = canvasRef.current.getContext('2d')!
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        DrawingUtils.drawConnectors(
          canvasCtx, 
          landmarks, 
          Hands.HAND_CONNECTIONS,
          { color: highContrast ? '#FFFF00' : '#00FF00', lineWidth: 5 }
        )
        DrawingUtils.drawLandmarks(
          canvasCtx, 
          landmarks, 
          { color: highContrast ? '#FFFFFF' : '#FF0000', lineWidth: 2 }
        )
      }
    }
    canvasCtx.restore()
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
        </div>
      )}
    </div>
  )
}

export default SignLanguageTranslator

