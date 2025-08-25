-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Music Lover')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update playlist updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_playlist_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.playlists 
  SET updated_at = NOW() 
  WHERE id = COALESCE(NEW.playlist_id, OLD.playlist_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update playlist timestamp when songs are added/removed
DROP TRIGGER IF EXISTS update_playlist_on_song_change ON public.playlist_songs;
CREATE TRIGGER update_playlist_on_song_change
  AFTER INSERT OR DELETE ON public.playlist_songs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_playlist_timestamp();

-- Function to increment song play count
CREATE OR REPLACE FUNCTION public.increment_play_count(song_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.songs 
  SET play_count = play_count + 1 
  WHERE id = song_uuid;
END;
$$;
