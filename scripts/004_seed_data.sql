-- Insert sample artists
INSERT INTO public.artists (id, name, bio, verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'The Midnight', 'Synthwave duo creating nostalgic electronic music', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Carpenter Brut', 'Dark synthwave artist with horror movie aesthetics', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Gunship', 'Synthwave band with cyberpunk influences', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'FM-84', 'Retro synthwave producer', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Timecop1983', 'Dreamy synthwave with nostalgic vibes', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample albums
INSERT INTO public.albums (id, title, artist_id, release_date) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Endless Summer', '550e8400-e29b-41d4-a716-446655440001', '2016-08-05'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Nocturne City', '550e8400-e29b-41d4-a716-446655440001', '2018-10-26'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Trilogy', '550e8400-e29b-41d4-a716-446655440002', '2015-10-30'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Dark All Day', '550e8400-e29b-41d4-a716-446655440003', '2018-10-26'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Atlas', '550e8400-e29b-41d4-a716-446655440004', '2016-12-02')
ON CONFLICT (id) DO NOTHING;

-- Insert sample songs
INSERT INTO public.songs (id, title, artist_id, album_id, duration, audio_url, genre) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Sunset', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 240, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Vampires', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 280, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Days of Thunder', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 320, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Crystalline', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 290, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440005', 'Turbo Killer', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 260, '/placeholder-audio.mp3', 'Dark Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440006', 'Hang Em All', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 300, '/placeholder-audio.mp3', 'Dark Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440007', 'Tech Noir', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 270, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440008', 'Fly for Your Life', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 310, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440009', 'Running in the Night', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', 250, '/placeholder-audio.mp3', 'Synthwave'),
  ('770e8400-e29b-41d4-a716-446655440010', 'Reflections', '550e8400-e29b-41d4-a716-446655440005', null, 280, '/placeholder-audio.mp3', 'Synthwave')
ON CONFLICT (id) DO NOTHING;
