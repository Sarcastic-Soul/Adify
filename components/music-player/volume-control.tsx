"use client"

import type React from "react"

import { useMusicPlayer } from "@/contexts/music-player-context"
import { Volume2, VolumeX } from "lucide-react"
import { useCallback } from "react"

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useMusicPlayer()

  const handleVolumeChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newVolume = Math.max(0, Math.min(1, percent))
      setVolume(newVolume)
    },
    [setVolume],
  )

  const displayVolume = isMuted ? 0 : volume

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
        {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <div className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group" onClick={handleVolumeChange}>
        <div
          className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
          style={{ width: `${displayVolume * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
