"use client"

import { useState } from "react"
import { Play, Pause, MoreHorizontal, Edit2, Trash2 } from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditPlaylistDialog } from "./edit-playlist-dialog"
import { DeletePlaylistDialog } from "./delete-playlist-dialog"

interface Playlist {
  id: string
  name: string
  description?: string
  user_id: string
  is_public: boolean
  created_at: string
  profiles?: {
    username?: string
    display_name?: string
  }
}

interface PlaylistHeaderProps {
  playlist: Playlist
  songCount: number
  isOwner: boolean
}

export function PlaylistHeader({ playlist, songCount, isOwner }: PlaylistHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { isPlaying, currentSong } = useMusicPlayer()

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  const ownerName = playlist.profiles?.display_name || playlist.profiles?.username || "Unknown User"

  return (
    <>
      <div className="bg-gradient-to-b from-purple-800/50 to-transparent p-6 pb-8">
        <div className="flex items-end gap-6">
          {/* Playlist Cover */}
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-6xl font-bold">{playlist.name.charAt(0)}</span>
          </div>

          {/* Playlist Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 break-words">{playlist.name}</h1>
            {playlist.description && <p className="text-gray-300 mb-4 text-lg">{playlist.description}</p>}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-medium">{ownerName}</span>
              <span>•</span>
              <span>{songCount} songs</span>
              <span>•</span>
              <span>{formatDate(playlist.created_at)}</span>
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

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="text-white hover:bg-gray-700">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <EditPlaylistDialog playlist={playlist} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <DeletePlaylistDialog playlist={playlist} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
