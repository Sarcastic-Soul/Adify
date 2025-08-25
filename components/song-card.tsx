"use client"

import { Play, Pause } from "lucide-react"
import Image from "next/image"
import { useMusicPlayer } from "@/contexts/music-player-context"

interface Song {
    id: string
    title: string
    artist_id: string
    duration: number
    audio_url: string
    cover_url?: string
    genre?: string
    play_count?: number
    artist?: {
        name: string
    }
}

interface SongCardProps {
    song: Song
    queue?: Song[]
    showArtist?: boolean
    className?: string
}

export function SongCard({ song, queue = [], showArtist = true, className = "" }: SongCardProps) {
    const { currentSong, isPlaying, playSong, playPause } = useMusicPlayer()

    const isCurrentSong = currentSong?.id === song.id
    const isCurrentlyPlaying = isCurrentSong && isPlaying

    const handlePlay = () => {
        if (isCurrentSong) {
            playPause()
        } else {
            playSong(song, queue.length > 0 ? queue : [song])
        }
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    return (
        <div
            className={`group bg-gray-900/40 hover:bg-gray-800/60 rounded-lg p-4 transition-all cursor-pointer ${className}`}
        >
            <div className="relative mb-4">
                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {song.cover_url ? (
                        <Image
                            src={song.cover_url || "/placeholder.svg"}
                            alt={song.title}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{song.title.charAt(0)}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handlePlay}
                    className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-lg"
                >
                    {isCurrentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
            </div>

            <div>
                <h3 className="text-white font-medium text-sm mb-1 truncate">{song.title}</h3>
                {showArtist && <p className="text-gray-400 text-xs truncate">{song.artist?.name || "Unknown Artist"}</p>}
                <p className="text-gray-500 text-xs mt-1">
                    {formatDuration(song.duration)}
                    {song.play_count && ` • ${song.play_count.toLocaleString()} plays`}
                </p>
            </div>
        </div>
    )
}