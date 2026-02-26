
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS summary text;
