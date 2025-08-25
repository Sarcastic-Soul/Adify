"use client"

import { useEffect, useRef } from "react"
import { useMusicPlayer } from "@/contexts/music-player-context"

export function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { audioRef, isPlaying } = useMusicPlayer()

  useEffect(() => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let audioContext: AudioContext
    let analyser: AnalyserNode
    let source: MediaElementAudioSourceNode
    let dataArray: Uint8Array

    const setupAudio = () => {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyser = audioContext.createAnalyser()
        source = audioContext.createMediaElementSource(audio)

        source.connect(analyser)
        analyser.connect(audioContext.destination)

        analyser.fftSize = 64
        dataArray = new Uint8Array(analyser.frequencyBinCount)
      } catch (error) {
        console.warn("Audio visualization not supported:", error)
      }
    }

    const draw = () => {
      if (!analyser || !dataArray) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / dataArray.length
      let x = 0

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8

        const hue = (i / dataArray.length) * 120 + 120 // Green to blue spectrum
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`

        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)
        x += barWidth
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    if (isPlaying && audio.src) {
      setupAudio()
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close()
      }
    }
  }, [isPlaying, audioRef])

  return <canvas ref={canvasRef} width={200} height={60} className="rounded opacity-60" />
}
