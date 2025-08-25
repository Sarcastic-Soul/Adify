"use client"

import { useMusicPlayer } from "@/contexts/music-player-context"
import { Pause, Play } from "lucide-react"
import Image from "next/image"

interface MiniPlayerProps {
  className?: string
}

export function MiniPlayer({ className = "" }: MiniPlayerProps) {
  const { currentSong, isPlaying, playPause } = useMusicPlayer()

  if (!currentSong) return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
        {currentSong.cover_url ? (
          <Image
            src={currentSong.cover_url || "/placeholder.svg"}
            alt={currentSong.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-white text-sm font-medium truncate">{currentSong.title}</h4>
        <p className="text-gray-400 text-xs truncate">{currentSong.artist?.name || "Unknown Artist"}</p>
      </div>
      <button
        onClick={playPause}
        className="bg-green-500 text-black rounded-full p-2 hover:bg-green-400 transition-colors"
      >
        {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
      </button>
    </div>
  )
}
