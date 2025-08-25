"use client"

import { useMusicPlayer } from "@/contexts/music-player-context"
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Loader2 } from "lucide-react"

export function PlayerControls() {
  const {
    isPlaying,
    isLoading,
    isBuffering,
    isShuffled,
    repeatMode,
    playPause,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    error,
  } = useMusicPlayer()

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleShuffle}
        className={`transition-colors ${isShuffled ? "text-green-500" : "text-gray-400 hover:text-white"}`}
        title="Toggle shuffle"
      >
        <Shuffle className="h-4 w-4" />
      </button>

      <button
        onClick={previousSong}
        className="text-gray-400 hover:text-white transition-colors"
        title="Previous song (Shift + ←)"
      >
        <SkipBack className="h-5 w-5" />
      </button>

      <button
        onClick={playPause}
        disabled={isLoading}
        className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        title="Play/Pause (Space)"
      >
        {isLoading || isBuffering ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      <button
        onClick={nextSong}
        className="text-gray-400 hover:text-white transition-colors"
        title="Next song (Shift + →)"
      >
        <SkipForward className="h-5 w-5" />
      </button>

      <button
        onClick={toggleRepeat}
        className={`transition-colors ${repeatMode !== "off" ? "text-green-500" : "text-gray-400 hover:text-white"}`}
        title={`Repeat: ${repeatMode}`}
      >
        {repeatMode === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
      </button>

      {error && (
        <div className="text-red-400 text-xs max-w-32 truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  )
}
