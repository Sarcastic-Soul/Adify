"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
}

interface EditProfileDialogProps {
  profile: Profile | null
  user: SupabaseUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({ profile, user, open, onOpenChange }: EditProfileDialogProps) {
  const [username, setUsername] = useState(profile?.username || "")
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open && profile) {
      setUsername(profile.username || "")
      setDisplayName(profile.display_name || "")
      setBio(profile.bio || "")
    }
  }, [open, profile])

  const handleSave = async () => {
    if (!username.trim()) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username.trim(),
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      })

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit profile</DialogTitle>
          <DialogDescription className="text-gray-400">Update your profile information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-white">
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="How others will see you"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
              placeholder="Tell us about yourself"
            />
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
            disabled={!username.trim() || isLoading}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
