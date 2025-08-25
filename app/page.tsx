"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/sidebar";
import { NowPlayingBar } from "@/components/music-player/now-playing-bar";
import { SongCard } from "@/components/song-card";
import { SongListItem } from "@/components/song-list-item";
import { redirect } from "next/navigation";

export default function HomePage() {
    const [featuredSongs, setFeaturedSongs] = useState<any[]>([]);
    const [recentSongs, setRecentSongs] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchSongs = async () => {
            const { data: user, error } = await supabase.auth.getUser();
            if (error || !user?.user) {
                redirect("/auth/login");
            }

            // Fetch featured songs and recent releases
            const { data: featured } = await supabase
                .from("songs")
                .select(
                    `
          *,
          artist:artists(name)
        `
                )
                .limit(6);
            setFeaturedSongs(featured || []);

            const { data: recent } = await supabase
                .from("songs")
                .select(
                    `
          *,
          artist:artists(name)
        `
                )
                .order("created_at", { ascending: false })
                .limit(10);
            setRecentSongs(recent || []);
        };

        fetchSongs();
    }, [supabase]);

    return (
        <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pb-24">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Hello</h1>
                        <p className="text-gray-400">Welcome back to your ads</p>
                    </div>

                    {/* Featured Section */}
                    {featuredSongs && featuredSongs.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Featured</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {featuredSongs.map((song) => (
                                    <SongCard key={song.id} song={song} queue={featuredSongs} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Recently Added */}
                    {recentSongs && recentSongs.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Recently Added
                            </h2>
                            <div className="bg-gray-900/20 rounded-lg p-4">
                                <div className="space-y-1">
                                    {recentSongs.map((song, index) => (
                                        <SongListItem
                                            key={song.id}
                                            song={song}
                                            queue={recentSongs}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Quick Picks */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Quick Picks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
                                    <span className="text-white text-xl">♥</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Liked Songs</h3>
                                    <p className="text-gray-400 text-sm">Your favorite tracks</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <NowPlayingBar />
        </div>
    );
}
