"use client"

import { useMusicPlayer } from "@/contexts/music-player-context"
import { PlayerControls } from "./player-controls"
import { ProgressBar } from "./progress-bar"
import { VolumeControl } from "./volume-control"
import { LikeButton } from "../like-button"
import { AudioVisualizer } from "../audio-visualizer"
import { KeyboardShortcutsHelp } from "../keyboard-shortcuts-help"
import Image from "next/image"

export function NowPlayingBar() {
  const { currentSong } = useMusicPlayer()

  if (!currentSong) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Current song info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-14 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            {currentSong.cover_url ? (
              <Image
                src={currentSong.cover_url || "/placeholder.svg"}
                alt={currentSong.title}
                width={56}
                height={56}
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
          <LikeButton songId={currentSong.id} />
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <PlayerControls />
          <ProgressBar />
        </div>

        {/* Volume and additional controls */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden lg:block">
            <AudioVisualizer />
          </div>
          <KeyboardShortcutsHelp />
          <VolumeControl />
        </div>
      </div>
    </div>
  )
}
