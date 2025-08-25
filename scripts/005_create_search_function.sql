CREATE OR REPLACE FUNCTION public.search_songs(search_term TEXT)
RETURNS TABLE(id UUID, title TEXT, artist_id UUID, duration INTEGER, audio_url TEXT, cover_url TEXT, genre TEXT, play_count INTEGER, artist_name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    s.id,
    s.title,
    s.artist_id,
    s.duration,
    s.audio_url,
    s.cover_url,
    s.genre,
    s.play_count,
    a.name AS artist_name
FROM
    public.songs AS s
        JOIN
    public.artists AS a ON s.artist_id = a.id
WHERE
    s.title ILIKE '%' || search_term || '%' OR
    a.name ILIKE '%' || search_term || '%';
END;
$$;