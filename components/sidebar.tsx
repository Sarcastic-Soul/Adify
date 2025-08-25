"use client"

import { Home, Search, Library, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { CreatePlaylistDialog } from "./create-playlist-dialog"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Playlist {
  id: string
  name: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const supabase = createClient()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/library", icon: Library, label: "Your Library" },
  ]

  useEffect(() => {
    if (user) {
      fetchPlaylists()
    }
  }, [user])

  const fetchPlaylists = async () => {
    if (!user) return

    const { data } = await supabase
      .from("playlists")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setPlaylists(data || [])
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 bg-black h-full flex flex-col">
      {/* Main Navigation */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-white font-bold text-xl">Spotify</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors ${
                isActive(item.href) ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Library Section */}
      <div className="px-6 py-4 border-t border-gray-800 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">PLAYLISTS</h3>
          <CreatePlaylistDialog />
        </div>

        <div className="space-y-2 overflow-y-auto max-h-64">
          <Link
            href="/liked"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/liked" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-sm">Liked Songs</span>
          </Link>

          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === `/playlist/${playlist.id}` ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">{playlist.name.charAt(0)}</span>
              </div>
              <span className="text-sm truncate">{playlist.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Section */}
      {user && (
        <div className="mt-auto p-6 border-t border-gray-800">
          <Link
            href="/profile"
            className={`flex items-center gap-3 mb-3 p-2 rounded-md transition-colors ${
              pathname === "/profile" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.user_metadata?.display_name || user.email}
              </p>
            </div>
          </Link>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full text-gray-400 border-gray-600 hover:text-white hover:border-gray-400 bg-transparent"
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
}
