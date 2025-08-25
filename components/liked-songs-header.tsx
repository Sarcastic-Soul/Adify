"use client"

import { Play, Pause, Heart } from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"
import { Button } from "@/components/ui/button"

interface LikedSongsHeaderProps {
  songCount: number
}

export function LikedSongsHeader({ songCount }: LikedSongsHeaderProps) {
  const { isPlaying } = useMusicPlayer()

  return (
    <div className="bg-gradient-to-b from-purple-800/50 to-transparent p-6 pb-8">
      <div className="flex items-end gap-6">
        {/* Liked Songs Icon */}
        <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-300 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
          <Heart className="h-24 w-24 text-white fill-white" />
        </div>

        {/* Liked Songs Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Liked Songs</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="font-medium">Your favorite tracks</span>
            <span>•</span>
            <span>{songCount} songs</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-400 text-black rounded-full w-14 h-14 p-0"
          disabled={songCount === 0}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
