"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Playlist {
  id: string
  name: string
  description?: string
}

interface AddToPlaylistDialogProps {
  songId: string
  children: React.ReactNode
}

export function AddToPlaylistDialog({ songId, children }: AddToPlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [addedPlaylists, setAddedPlaylists] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (open && user) {
      fetchPlaylists()
    }
  }, [open, user])

  const fetchPlaylists = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Fetch user's playlists
      const { data: playlistsData } = await supabase
        .from("playlists")
        .select("id, name, description")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Check which playlists already contain this song
      const { data: existingSongs } = await supabase.from("playlist_songs").select("playlist_id").eq("song_id", songId)

      setPlaylists(playlistsData || [])
      setAddedPlaylists(new Set(existingSongs?.map((item) => item.playlist_id) || []))
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSongInPlaylist = async (playlistId: string) => {
    if (!user) return

    const isAdded = addedPlaylists.has(playlistId)

    try {
      if (isAdded) {
        // Remove from playlist
        await supabase.from("playlist_songs").delete().eq("playlist_id", playlistId).eq("song_id", songId)

        setAddedPlaylists((prev) => {
          const newSet = new Set(prev)
          newSet.delete(playlistId)
          return newSet
        })
      } else {
        // Add to playlist
        // Get the next position
        const { data: existingSongs } = await supabase
          .from("playlist_songs")
          .select("position")
          .eq("playlist_id", playlistId)
          .order("position", { ascending: false })
          .limit(1)

        const nextPosition = existingSongs?.[0]?.position ? existingSongs[0].position + 1 : 0

        await supabase.from("playlist_songs").insert({
          playlist_id: playlistId,
          song_id: songId,
          position: nextPosition,
        })

        setAddedPlaylists((prev) => new Set([...prev, playlistId]))
      }
    } catch (error) {
      console.error("Error updating playlist:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add to playlist</DialogTitle>
          <DialogDescription className="text-gray-400">Choose a playlist to add this song to.</DialogDescription>
        </DialogHeader>
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-400">Loading playlists...</div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No playlists found. Create one first!</div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isAdded = addedPlaylists.has(playlist.id)
                return (
                  <button
                    key={playlist.id}
                    onClick={() => toggleSongInPlaylist(playlist.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <div>
                      <h4 className="text-white font-medium">{playlist.name}</h4>
                      {playlist.description && <p className="text-gray-400 text-sm">{playlist.description}</p>}
                    </div>
                    {isAdded && <Check className="h-5 w-5 text-green-500" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
