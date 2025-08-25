"use client"

import type React from "react"

import { useMusicPlayer } from "@/contexts/music-player-context"
import { useCallback, useState } from "react"

export function ProgressBar() {
  const { currentTime, duration, seekTo, isBuffering } = useMusicPlayer()
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      seekTo(newTime)
    },
    [duration, seekTo],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      setDragTime(newTime)
    },
    [duration],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const progressBar = document.querySelector("[data-progress-bar]") as HTMLElement
      if (!progressBar) return

      const rect = progressBar.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newTime = percent * duration
      setDragTime(newTime)
    },
    [isDragging, duration],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      seekTo(dragTime)
      setIsDragging(false)
    }
  }, [isDragging, dragTime, seekTo])

  useState(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  })

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const displayTime = isDragging ? dragTime : currentTime
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="w-10 text-right">{formatTime(displayTime)}</span>
      <div
        data-progress-bar
        className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group relative"
        onClick={handleSeek}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`h-full rounded-full relative transition-colors ${
            isBuffering ? "bg-yellow-500" : "bg-white group-hover:bg-green-500"
          }`}
          style={{ width: `${progress}%` }}
        >
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity ${
              isDragging || progress > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </div>
      </div>
      <span className="w-10">{formatTime(duration)}</span>
    </div>
  )
}
