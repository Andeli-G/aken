-- Proverbes bulu : tables, sécurité et source.
-- À exécuter une seule fois dans le SQL Editor de Supabase (remplace les migrations de proverbes précédentes).
-- Ce fichier ne contient AUCUN texte de l'article : les proverbes sont chargés par scripts/import-proverbs.mjs.

-- 1. La source (créée si elle n'existe pas, mise à jour sinon)
insert into public.sources (title, authors, publisher, year, place, status, notes)
select 'Proverbes bulu', 'Maxime Meto''o', 'Revue Notre Librairie (n° 99)', 1989, 'Paris', 'confirmed',
       'Pages 54 à 58, section Littérature orale.'
where not exists (select 1 from public.sources where title = 'Proverbes bulu');

update public.sources set
  authors = 'Maxime Meto''o', publisher = 'Revue Notre Librairie (n° 99)', year = 1989, place = 'Paris',
  status = 'confirmed', notes = 'Pages 54 à 58, section Littérature orale.'
where title = 'Proverbes bulu';

-- 2. Les proverbes
create table if not exists public.proverbs (
  id                bigint generated always as identity primary key,
  slug              text unique not null,
  title             text,
  bulu              text not null,
  phonetic          text,
  french            text not null,
  french_by         text not null default 'author' check (french_by in ('author', 'akene')),
  theme             text,
  theme_category    text,
  author_commentary text,                 -- ce que dit l'auteur (résumé attribué ou citation courte)
  editor_note       text,                 -- note d'Akeñ : nos propres ajouts
  equivalents       jsonb not null default '[]',
  source_id         bigint references public.sources(id) on delete set null,
  source_page       int,
  status            content_status not null default 'draft',
  created_at        timestamptz not null default now()
);
create index if not exists proverbs_status_idx on public.proverbs (status);
create index if not exists proverbs_theme_idx  on public.proverbs (theme_category);

-- 3. Les commentaires des utilisateurs (modérés)
create table if not exists public.proverb_comments (
  id         bigint generated always as identity primary key,
  proverb_id bigint not null references public.proverbs(id) on delete cascade,
  user_id    uuid   not null references public.profiles(id) on delete cascade,
  body       text   not null check (length(body) between 1 and 2000),
  status     comment_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- 4. Sécurité
alter table public.proverbs         enable row level security;
alter table public.proverb_comments enable row level security;

create policy proverbs_read  on public.proverbs for select using (status = 'published' or public.is_admin());
create policy proverbs_admin on public.proverbs for all    using (public.is_admin()) with check (public.is_admin());

create policy proverb_comments_read   on public.proverb_comments for select
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy proverb_comments_insert on public.proverb_comments for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
create policy proverb_comments_delete on public.proverb_comments for delete using (user_id = auth.uid());
create policy proverb_comments_admin  on public.proverb_comments for all
  using (public.is_admin()) with check (public.is_admin());

-- 5. Vérification : doit afficher 1 ligne pour la source, puis les règles des deux tables
select id, title, status from public.sources where title = 'Proverbes bulu';
select tablename, policyname, cmd from pg_policies
where tablename in ('proverbs', 'proverb_comments') order by tablename, policyname;
