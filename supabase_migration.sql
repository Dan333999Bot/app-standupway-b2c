-- ═══════════════════════════════════════════════════════════
-- StandUp Way – CMS Migration
-- Run this in: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ── 1. app_config: Stripe URLs, video embed URLs, copy ──────
create table if not exists app_config (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

insert into app_config (key, value) values
  ('stripe_colloquio_url',    ''),
  ('stripe_percorso_6m_url',  ''),
  ('stripe_percorso_12m_url', ''),
  ('home_video_1_url',        ''),
  ('home_video_1_title',      'Cos''è StandUpWay'),
  ('home_video_2_url',        ''),
  ('home_video_2_title',      'Come iniziare un percorso')
on conflict (key) do nothing;

-- ── 2. user_state: per-user journey status ──────────────────
create table if not exists user_state (
  user_id text primary key,
  first_colloquio_done boolean default false,
  first_colloquio_date timestamptz,
  percorso_active boolean default false,
  percorso_start_date timestamptz,
  percorso_level text,        -- 'basso' | 'medio' | 'alto'
  percorso_type text,         -- 'alcol' | 'crack-cocaina' | etc.
  percorso_duration text,     -- '6m' | '12m'
  preventivo_unlocked boolean default false,
  clean_date timestamptz,
  notes text,
  updated_at timestamptz default now()
);

-- ── 3. corsi: editable course catalog ───────────────────────
create table if not exists corsi (
  id serial primary key,
  title text not null,
  description text,
  duration text,
  lessons int default 0,
  price text default 'Gratuito',
  free boolean default true,
  image_url text,
  stripe_url text,
  sort_order int default 0,
  active boolean default true,
  updated_at timestamptz default now()
);

insert into corsi (id, title, description, duration, lessons, price, free, image_url, sort_order) values
  (1,  'Fondamenti del Recupero',      'Le basi per iniziare il tuo percorso di cambiamento',              '2h 30min', 8,  'Gratuito', true,  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop', 1),
  (2,  'Capire la Dipendenza',         'Cos''è la dipendenza e come funziona il cervello',                 '1h 20min', 5,  'Gratuito', true,  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop', 2),
  (3,  'Gestire i Trigger',            'Tecniche pratiche per riconoscere e gestire i trigger quotidiani', '1h 45min', 6,  '29€',      false, 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop', 3),
  (4,  'Mindfulness per il Recupero',  'Pratiche di consapevolezza per la vita quotidiana',                '3h 15min', 12, '39€',      false, 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop', 4),
  (5,  'Ricostruire le Relazioni',     'Come riparare e costruire relazioni sane dopo la dipendenza',      '2h 00min', 7,  '35€',      false, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', 5),
  (6,  'Prevenzione delle Ricadute',   'Strategie concrete per prevenire le ricadute nel lungo termine',   '2h 30min', 9,  '39€',      false, 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop', 6),
  (7,  'Gestione dello Stress',        'Tecniche di rilassamento e gestione dello stress quotidiano',      '1h 50min', 7,  '29€',      false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 7),
  (8,  'Nutrizione e Recupero',        'L''importanza dell''alimentazione nel percorso di recupero',       '1h 30min', 6,  '29€',      false, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', 8),
  (9,  'Sonno e Benessere',            'Migliorare la qualità del sonno durante il recupero',              '1h 15min', 5,  '29€',      false, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop', 9),
  (10, 'Costruire una Nuova Identità', 'Riscoprire chi sei al di là della dipendenza',                    '3h 00min', 10, '49€',      false, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop', 10)
on conflict (id) do nothing;

-- ── 4. live_events: in-person events with dates/locations ───
create table if not exists live_events (
  id serial primary key,
  title text not null,
  description text,
  event_date timestamptz,
  location text,
  city text,
  price text default 'Gratuito',
  free boolean default true,
  max_attendees int,
  image_url text,
  stripe_url text,
  active boolean default true,
  updated_at timestamptz default now()
);

-- ── 5. questionnaire_steps: editable questionnaire copy ─────
create table if not exists questionnaire_steps (
  id serial primary key,
  percorso_id text not null,  -- 'common' | 'intro' | 'crack-cocaina' | 'alcol' | etc.
  step_index int not null,
  kind text not null check (kind in ('question','feedback')),
  title text,
  subtitle text,
  body text,
  emoji text,
  options jsonb,              -- [{label: string, weight: number}]
  active boolean default true,
  unique(percorso_id, step_index)
);

-- ── 6. Disable RLS (anon read/write like events table) ──────
alter table app_config         disable row level security;
alter table user_state         disable row level security;
alter table corsi               disable row level security;
alter table live_events        disable row level security;
alter table questionnaire_steps disable row level security;
