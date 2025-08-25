"use client"

import { Play, Pause, MoreHorizontal, Plus } from "lucide-react"
import Image from "next/image"
import { useMusicPlayer } from "@/contexts/music-player-context"
import { AddToPlaylistDialog } from "./add-to-playlist-dialog"
import { LikeButton } from "./like-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Song {
    id: string
    title: string
    artist_id: string
    duration: number
    audio_url: string
    cover_url?: string
    genre?: string
    artist?: {
        name: string
    }
}

interface SongListItemProps {
    song: Song
    queue?: Song[]
    index?: number
    showCover?: boolean
}

export function SongListItem({ song, queue = [], index, showCover = true }: SongListItemProps) {
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
        <div className="group flex items-center gap-4 p-2 rounded-md hover:bg-gray-800/50 transition-colors">
            {/* Index/Play button */}
            <div className="w-4 text-center">
                {isCurrentlyPlaying ? (
                    <button onClick={handlePlay} className="text-green-500">
                        <Pause className="h-4 w-4" />
                    </button>
                ) : (
                    <>
                        <span className="text-gray-400 text-sm group-hover:hidden">{index !== undefined ? index + 1 : ""}</span>
                        <button onClick={handlePlay} className="hidden group-hover:block text-white hover:text-green-500">
                            <Play className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {/* Cover art */}
            {showCover && (
                <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    {song.cover_url ? (
                        <Image
                            src={song.cover_url || "/placeholder.svg"}
                            alt={song.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    )}
                </div>
            )}

            {/* Song info */}
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium truncate ${isCurrentSong ? "text-green-500" : "text-white"}`}>
                    {song.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">{song.artist?.name || "Unknown Artist"}</p>
            </div>

            {/* Duration and actions */}
            <div className="flex items-center gap-2">
                <LikeButton songId={song.id} />

                <span className="text-gray-400 text-sm">{formatDuration(song.duration)}</span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <AddToPlaylistDialog songId={song.id}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-white hover:bg-gray-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add to playlist
                            </DropdownMenuItem>
                        </AddToPlaylistDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
