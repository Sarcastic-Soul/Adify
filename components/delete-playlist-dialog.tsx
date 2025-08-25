"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Playlist {
  id: string
  name: string
}

interface DeletePlaylistDialogProps {
  playlist: Playlist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePlaylistDialog({ playlist, open, onOpenChange }: DeletePlaylistDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("playlists").delete().eq("id", playlist.id)

      if (error) throw error

      onOpenChange(false)
      router.push("/library")
      router.refresh()
    } catch (error) {
      console.error("Error deleting playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Delete playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-400"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
