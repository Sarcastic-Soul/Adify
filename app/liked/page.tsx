import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { NowPlayingBar } from "@/components/music-player/now-playing-bar"
import { SongListItem } from "@/components/song-list-item"
import { LikedSongsHeader } from "@/components/liked-songs-header"

export default async function LikedSongsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch liked songs
  const { data: likedSongs } = await supabase
    .from("user_liked_songs")
    .select(`
      *,
      song:songs(
        *,
        artist:artists(name),
        album:albums(title)
      )
    `)
    .eq("user_id", data.user.id)
    .order("liked_at", { ascending: false })

  const songs = likedSongs?.map((item) => item.song).filter(Boolean) || []

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <LikedSongsHeader songCount={songs.length} />

        <div className="p-6">
          {songs.length > 0 ? (
            <div className="space-y-1">
              {songs.map((song, index) => (
                <SongListItem key={song.id} song={song} queue={songs} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-white mb-2">Songs you like will appear here</h3>
              <p className="text-gray-400">Save songs by tapping the heart icon</p>
            </div>
          )}
        </div>
      </main>

      <NowPlayingBar />
    </div>
  )
}
