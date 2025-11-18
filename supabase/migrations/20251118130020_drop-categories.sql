ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_category_id_fkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_category_id_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_category_id_fkey;

DROP TABLE IF EXISTS public.categories;
