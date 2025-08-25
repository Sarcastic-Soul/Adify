"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  description?: string
  is_public: boolean
}

interface EditPlaylistDialogProps {
  playlist: Playlist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPlaylistDialog({ playlist, open, onOpenChange }: EditPlaylistDialogProps) {
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description || "")
  const [isPublic, setIsPublic] = useState(playlist.is_public)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      setName(playlist.name)
      setDescription(playlist.description || "")
      setIsPublic(playlist.is_public)
    }
  }, [open, playlist])

  const handleSave = async () => {
    if (!name.trim()) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("playlists")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
        })
        .eq("id", playlist.id)

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit playlist details</DialogTitle>
          <DialogDescription className="text-gray-400">Update your playlist information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-white">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-white">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="edit-public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="edit-public" className="text-white">
              Make playlist public
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
