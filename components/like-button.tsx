"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

interface LikeButtonProps {
  songId: string
  className?: string
}

export function LikeButton({ songId, className = "" }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      checkLikeStatus()
    }
  }, [user, songId])

  const checkLikeStatus = async () => {
    if (!user) return

    const { data } = await supabase
      .from("user_liked_songs")
      .select("id")
      .eq("user_id", user.id)
      .eq("song_id", songId)
      .single()

    setIsLiked(!!data)
  }

  const toggleLike = async () => {
    if (!user || isLoading) return

    setIsLoading(true)

    try {
      if (isLiked) {
        // Unlike the song
        await supabase.from("user_liked_songs").delete().eq("user_id", user.id).eq("song_id", songId)

        setIsLiked(false)
      } else {
        // Like the song
        await supabase.from("user_liked_songs").insert({
          user_id: user.id,
          song_id: songId,
        })

        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`transition-colors ${
        isLiked ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-white"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
    </button>
  )
}
