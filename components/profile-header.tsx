"use client"

import { useState } from "react"
import { Edit2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditProfileDialog } from "./edit-profile-dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
  created_at: string
}

interface ProfileHeaderProps {
  profile: Profile | null
  user: SupabaseUser
  playlistCount: number
  likedSongsCount: number
}

export function ProfileHeader({ profile, user, playlistCount, likedSongsCount }: ProfileHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const displayName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "User"
  const joinDate = new Date(user.created_at).getFullYear()

  return (
    <>
      <div className="bg-gradient-to-b from-blue-800/50 to-transparent p-6 pb-8">
        <div className="flex items-end gap-6">
          {/* Profile Picture */}
          <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-24 w-24 text-white" />
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white mb-2">Profile</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 break-words">{displayName}</h1>
            {profile?.bio && <p className="text-gray-300 mb-4 text-lg">{profile.bio}</p>}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>{playlistCount} public playlists</span>
              <span>•</span>
              <span>{likedSongsCount} liked songs</span>
              <span>•</span>
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button
            onClick={() => setShowEditDialog(true)}
            variant="outline"
            className="bg-transparent border-gray-400 text-white hover:bg-gray-800"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit profile
          </Button>
        </div>
      </div>

      <EditProfileDialog profile={profile} user={user} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </>
  )
}
