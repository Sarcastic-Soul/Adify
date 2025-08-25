import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { NowPlayingBar } from "@/components/music-player/now-playing-bar"

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Your Library</h1>

          <div className="text-center py-12">
            <h2 className="text-xl text-white mb-4">Your library is empty</h2>
            <p className="text-gray-400 mb-6">Start building your music collection</p>
          </div>
        </div>
      </main>

      <NowPlayingBar />
    </div>
  )
}
