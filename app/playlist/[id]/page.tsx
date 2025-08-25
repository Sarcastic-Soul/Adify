import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { NowPlayingBar } from "@/components/music-player/now-playing-bar";
import { SongListItem } from "@/components/song-list-item";
import { PlaylistHeader } from "@/components/playlist-header";

interface PlaylistPageProps {
    params: {
        id: string;
    };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
    const { id } = await params;
    // console.log(id);
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
        redirect("/auth/login");
    }

    // Fetch playlist details
    const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .select(
            `
      *,
      profiles:user_id(username, display_name)
    `
        )
        .eq("id", id)
        .single();

    if (playlistError || !playlist) {
        console.log("errror1");
        console.log(playlistError);
        console.log(playlistError);
        notFound();
    }

    // Check if user can access this playlist
    if (!playlist.is_public && playlist.user_id !== user.user.id) {
        notFound();
    }

    // Fetch playlist songs
    const { data: playlistSongs } = await supabase
        .from("playlist_songs")
        .select(
            `
      *,
      song:songs(
        *,
        artist:artists(name),
        album:albums(title)
      )
    `
        )
        .eq("playlist_id", id)
        .order("position", { ascending: true });

    const songs = playlistSongs?.map((item) => item.song).filter(Boolean) || [];

    return (
        <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
            <Sidebar />

            <main className="flex-1 overflow-y-auto pb-24">
                <PlaylistHeader
                    playlist={playlist}
                    songCount={songs.length}
                    isOwner={playlist.user_id === user.user.id}
                />

                <div className="p-6">
                    {songs.length > 0 ? (
                        <div className="space-y-1">
                            {songs.map((song, index) => (
                                <SongListItem
                                    key={song.id}
                                    song={song}
                                    queue={songs}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl text-white mb-2">
                                This playlist is empty
                            </h3>
                            <p className="text-gray-400">Add some songs to get started</p>
                        </div>
                    )}
                </div>
            </main>

            <NowPlayingBar />
        </div>
    );
}