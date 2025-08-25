import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { NowPlayingBar } from "@/components/music-player/now-playing-bar"
import { ProfileHeader } from "@/components/profile-header"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Fetch user's playlists count
  const { count: playlistCount } = await supabase
    .from("playlists")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  // Fetch user's liked songs count
  const { count: likedSongsCount } = await supabase
    .from("user_liked_songs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <ProfileHeader
          profile={profile}
          user={data.user}
          playlistCount={playlistCount || 0}
          likedSongsCount={likedSongsCount || 0}
        />

        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl text-white mb-4">Your music journey starts here</h2>
            <p className="text-gray-400">Start listening to build your profile</p>
          </div>
        </div>
      </main>

      <NowPlayingBar />
    </div>
  )
}
