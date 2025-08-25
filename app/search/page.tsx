"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Sidebar } from "@/components/sidebar"
import { NowPlayingBar } from "@/components/music-player/now-playing-bar"
import { SongListItem } from "@/components/song-list-item"
import { Input } from "@/components/ui/input"

interface Song {
    id: string
    title: string
    artist_id: string
    duration: number
    audio_url: string
    cover_url?: string
    genre?: string
    play_count?: number
    artist?: {
        name: string
    }
}

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Song[]>([])
    const [loading, setLoading] = useState(false)
    const [genres, setGenres] = useState<string[]>([])
    const supabase = createClient()

    // Fetch popular genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            const { data } = await supabase.from("songs").select("genre").not("genre", "is", null)

            if (data) {
                const uniqueGenres = [...new Set(data.map((item) => item.genre).filter(Boolean))]
                setGenres(uniqueGenres.slice(0, 8))
            }
        }

        fetchGenres()
    }, [supabase])

    // Search function
    useEffect(() => {
        const searchSongs = async () => {
            if (!query.trim()) {
                setResults([])
                return
            }

            setLoading(true)

            const { data } = await supabase.rpc('search_songs', { search_term: query }).limit(20)

            const formattedData = data?.map(item => ({
                ...item,
                artist: { name: item.artist_name }
            }))

            setResults(formattedData || [])
            setLoading(false)
        }

        const debounceTimer = setTimeout(searchSongs, 300)
        return () => clearTimeout(debounceTimer)
    }, [query, supabase])

    const genreColors = [
        "from-red-500 to-red-700",
        "from-blue-500 to-blue-700",
        "from-green-500 to-green-700",
        "from-purple-500 to-purple-700",
        "from-yellow-500 to-yellow-700",
        "from-pink-500 to-pink-700",
        "from-indigo-500 to-indigo-700",
        "from-orange-500 to-orange-700",
    ]

    return (
        <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pb-24">
                <div className="p-6">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="What do you want to listen to?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Search Results */}
                    {query && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                {loading ? "Searching..." : `Results for "${query}"`}
                            </h2>

                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((song, index) => (
                                        <SongListItem key={song.id} song={song} queue={results} index={index} />
                                    ))}
                                </div>
                            ) : (
                                !loading && <p className="text-gray-400">No results found for "{query}"</p>
                            )}
                        </section>
                    )}

                    {/* Browse by Genre */}
                    {!query && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {genres.map((genre, index) => (
                                    <div
                                        key={genre}
                                        className={`bg-gradient-to-br ${genreColors[index % genreColors.length]} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                                    >
                                        <h3 className="text-white font-bold text-xl">{genre}</h3>
                                        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-black/20 rounded-full transform rotate-12" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <NowPlayingBar />
        </div>
    )
}