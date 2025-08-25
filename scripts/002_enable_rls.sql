-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_plays ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Artists policies (read-only for users, admin-managed)
CREATE POLICY "Anyone can view artists" ON public.artists FOR SELECT USING (true);

-- Albums policies (read-only for users, admin-managed)
CREATE POLICY "Anyone can view albums" ON public.albums FOR SELECT USING (true);

-- Songs policies (read-only for users, admin-managed)
CREATE POLICY "Anyone can view songs" ON public.songs FOR SELECT USING (true);

-- Playlists policies
CREATE POLICY "Users can view public playlists and own playlists" ON public.playlists 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create own playlists" ON public.playlists 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.playlists 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.playlists 
  FOR DELETE USING (auth.uid() = user_id);

-- Playlist songs policies
CREATE POLICY "Users can view playlist songs for accessible playlists" ON public.playlist_songs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id = auth.uid())
    )
  );
CREATE POLICY "Users can manage songs in own playlists" ON public.playlist_songs 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- User liked songs policies
CREATE POLICY "Users can view own liked songs" ON public.user_liked_songs 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own liked songs" ON public.user_liked_songs 
  FOR ALL USING (auth.uid() = user_id);

-- User follows policies
CREATE POLICY "Users can view all follows" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON public.user_follows 
  FOR ALL USING (auth.uid() = follower_id);

-- Recent plays policies
CREATE POLICY "Users can view own recent plays" ON public.recent_plays 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recent plays" ON public.recent_plays 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
