'use client'

import { useEffect, useRef, useState } from 'react'
import * as Hands from '@mediapipe/hands'
import * as DrawingUtils from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'

const SignLanguageTranslator = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    if (!translating) return

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
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({image: videoRef.current})
          }
        },
        width: 640,
        height: 480
      })
      camera.start()
    }

    return () => {
      hands.close()
    }
  }, [translating])

  interface HandResults {
    image: CanvasImageSource;
    multiHandLandmarks?: Array<Hands.NormalizedLandmarkList>;
  }

  const onResults = (results: HandResults): void => {
    if (!canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        DrawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS,
                                   {color: '#00FF00', lineWidth: 5});
        DrawingUtils.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      }
    }
    canvasCtx.restore();
  }

  const toggleTranslation = () => {
    setTranslating(!translating)
  }

  return (
    <div className="mt-4">
      <button 
        onClick={toggleTranslation} 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {translating ? 'Stop Translation' : 'Start Sign Language Translation'}
      </button>
      {translating && (
        <div className="mt-4 relative">
          <video ref={videoRef} className="w-full" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        </div>
      )}
    </div>
  )
}

export default SignLanguageTranslator

