-- Migration pour les proverbes bulu (Ngana)
-- Source : Maxime Meto'o, Revue « Notre Librairie », n° 99, 1989, pp. 54-58.

-- 1. Enregistrement / mise à jour de la source
insert into public.sources (id, title, authors, publisher, year, place, status, notes)
values (
  3,
  'Proverbes bulu',
  'Maxime Meto''o',
  'Revue Notre Librairie (n° 99)',
  1989,
  'Paris',
  'confirmed',
  'Pages 54 à 58, section Littérature orale. Revue Notre Librairie n° 99 (octobre-décembre 1989).'
)
on conflict (id) do update set
  publisher = excluded.publisher,
  year = excluded.year,
  place = excluded.place,
  status = excluded.status,
  notes = excluded.notes;

-- 2. Création de la table des proverbes
create table if not exists public.proverbs (
  id serial primary key,
  slug text unique not null,
  title text,
  bulu text not null,
  phonetic text,
  french text not null,
  theme text,
  theme_category text, -- 'animal', 'vegetal', 'social', 'endurance', 'amour', 'dette'
  commentary text,
  equivalents jsonb default '[]'::jsonb,
  source_id integer references public.sources(id) on delete set null,
  source_page integer,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

-- Index pour la recherche et les tris
create index if not exists idx_proverbs_status on public.proverbs(status);
create index if not exists idx_proverbs_theme_category on public.proverbs(theme_category);

-- RLS (Sécurité au niveau des lignes)
alter table public.proverbs enable row level security;

create policy "Lecture publique des proverbes publiés"
  on public.proverbs for select
  using (status = 'published');

-- 3. Table pour les commentaires et notes de la communauté / administratrice
create table if not exists public.proverb_comments (
  id serial primary key,
  proverb_id integer not null references public.proverbs(id) on delete cascade,
  author_name text,
  content text not null,
  status text not null default 'published' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.proverb_comments enable row level security;

create policy "Lecture publique des commentaires publiés sur les proverbes"
  on public.proverb_comments for select
  using (status = 'published');

create policy "Ajout de commentaires sur les proverbes"
  on public.proverb_comments for insert
  with check (true);

-- 4. Insertion des 7 proverbes transcrits du document de Maxime Meto'o
insert into public.proverbs (id, slug, title, bulu, french, theme, theme_category, commentary, equivalents, source_id, source_page, status)
values
(
  1,
  'same-same-a-nga-toe-eves',
  'Les morceaux et les os',
  'Same same a nga toé êves',
  'Celui qui ne cesse de tourner et retourner les morceaux finit par ramasser un os.',
  'L’opportunité et le discernement',
  'social',
  'D''après ces proverbes, celui qui cherche à tout posséder souvent perd tout. Le proverbe bulu se situe dans le contexte du repas communautaire où, après la sauce, chaque membre dans un ordre hiérarchique avait droit à un morceau de viande. Celui qui voulait s''assurer le meilleur choix, en volume et en qualité, risquait à la fin, le temps faisant défaut à cause de l''attente des autres membres, de ne s''octroyer qu''un os. Le proverbe châtie l''hésitation, l''indécision qui oscille entre les divers choix possibles, n''osant prendre parti de peur d''être lésé.',
  '[
    {"language": "Espagnol", "text": "Galgo que muchas liebres levanta ninguna mata", "translation": "Lévrier qui lève trop de lièvres n’en tue aucun."},
    {"language": "Français", "text": "Il ne faut pas courir deux lièvres à la fois", "translation": "On s’appauvrit souvent en voulant trop gagner."},
    {"language": "Français (La Fontaine)", "text": "Le Chien qui lâche sa proie pour l’ombre (VI, 17)", "translation": "« On voit courir après l''ombre / Tant de fous, qu''on ne sait pas / La plupart du temps le nombre »"},
    {"language": "Espagnol", "text": "Cuando te dieren el anillo, pon el dedillo", "translation": "Tends le doigt à qui présente l''anneau."},
    {"language": "Anglais", "text": "When the shoulder of mutton is going, ''tis good to take a slice", "translation": "Quand on sert l''épaule de mouton, il est bon d''en prendre un morceau."},
    {"language": "Anglais", "text": "He that will not when he may, when he will he shall have Nay", "translation": "Celui qui dédaigne de saisir l''opportunité au moment où elle passe n''aura rien quand le besoin se fera sentir."}
  ]'::jsonb,
  3,
  55,
  'published'
),
(
  2,
  'te-wua-ofukaa-si-te-tobane-kuna-nsen',
  'La torche et la rosée',
  'Te wua ôfuka’a si te ô tôbane kuna nsen',
  'Ne jette pas ta torche à chasser la rosée avant d''avoir rencontré le voyageur matinal.',
  'La prudence et la prévoyance',
  'endurance',
  'Le proverbe bulu souligne qu''un tiens vaut mieux que deux tu l''auras. L''ôfuka''a désigne le bâton ou la branche feuillue dont on se sert de grand matin pour écarter la rosée froide qui encombre le sentier. Ne vous dessaisissez pas de votre instrument ou de votre protection tant qu''un autre marcheur plus matinal n''a pas ouvert la voie devant vous. Il vaut mieux conserver ce qu''on tient que courir vers une promesse incertaine.',
  '[
    {"language": "Espagnol", "text": "Más vale pájaro en mano que ciento volando", "translation": "Un oiseau dans la main vaut mieux que cent en plein vol."},
    {"language": "Espagnol", "text": "Más vale salto de mata que ruego de buenos", "translation": "Il vaut mieux tenir que courir."},
    {"language": "Anglais", "text": "We never know the worth of water till the well is dry", "translation": "On ne découvre la valeur de l''eau que quand le puits est sec."}
  ]'::jsonb,
  3,
  56,
  'published'
),
(
  3,
  'ngoe-a-nga-sup-minlak-ndom-nyan-ebili',
  'Le cochon sans cornes',
  'Ngoé a nga sup minlak ndom nyan ébili',
  'Le cochon est resté sans cornes alors que son oncle maternel les distribuait.',
  'L''animal et la négligence',
  'animal',
  'On peut passer à côté des avantages que détiennent nos parents par velléité ou excès de confiance. Le cochon apprit que son oncle maternel distribuait des cornes aux animaux, mais par négligence et excès de confiance, il a laissé s''écouler trop de temps. Quand il est venu chercher ses cornes, il n''y avait plus que des bosses. S''il s''était un peu plus dépêché, il aurait eu une belle paire de cornes. La leçon qui se dégage de cet apologue est qu''il ne faut pas espérer partager l''usufruit d''un bien qui n''est pas encore en notre possession. Il faut profiter de l''occasion qui se présente.',
  '[
    {"language": "Espagnol", "text": "Dure lo que durare como cuchara de pan", "translation": "Que cela dure tant que cela dure, comme une cuillère de pain."},
    {"language": "Chinois", "text": "Si le ciel fait tomber une datte, ouvre la bouche", "translation": "Sache saisir les dons au moment opportun."},
    {"language": "Anglais", "text": "Put out your tubs when it is raining", "translation": "Sors tes bassines quand il pleut."},
    {"language": "Anglais", "text": "When fortune smiles, embrace her", "translation": "Quand la fortune te sourit, embrasse-la."}
  ]'::jsonb,
  3,
  56,
  'published'
),
(
  4,
  'a-bo-ke-a-boo-na-otele-kindii-yai-wo-na-osoe-kpwa',
  'Traverser la rivière',
  'A bo ke a bo’o na, ôtele kindii yai wô na ôsôé kpwa',
  'Ce n''est pas quand on est sur la rive qu''on affirme avoir traversé la rivière.',
  'L''anticipation et la modestie',
  'endurance',
  'Ce n''est pas au moment des projets qu''on crie victoire. Car la communauté où on annonce le succès voudra vérifier l''exactitude de vos dires. Elle conclura sur le mensonge si ce cri a été poussé prématurément au stade des projets. Le proverbe espagnol qui reprend la même idée met l''accent sur la nécessité d''attendre la fin qui couronne l''œuvre. Une variante souligne aussi : « Celui qui n''a pas encore traversé l''autre rive ne doit pas se moquer de celui qui se noie. »',
  '[
    {"language": "Espagnol", "text": "Hasta el fin no se canta victoria", "translation": "La fin couronne l''œuvre."},
    {"language": "Français", "text": "Il ne faut jamais vendre la peau de l''ours avant de l''avoir mis par terre", "translation": "La Fontaine, La Laitière et le pot au lait (VII, 10)."},
    {"language": "Anglais", "text": "Don''t count your chickens before they are hatched", "translation": "Ne comptez pas vos poulets avant que les poussins ne sortent des œufs."}
  ]'::jsonb,
  3,
  57,
  'published'
),
(
  5,
  'abim-otonon-abim-te-dumba',
  'À petit oiseau, petit nid',
  'Abim ôtonon abim te dumba’a',
  'À petit oiseau, petit nid.',
  'La mesure de soi et les limites',
  'animal',
  'L''idée de ce proverbe se résume dans la nécessité de connaître ses propres limites. Chacun doit adapter son envergure à ses ressources et à son rôle sans présomption ni amertume. La sagesse réside dans l''acceptation de son juste équilibre au sein de la communauté.',
  '[
    {"language": "Espagnol", "text": "Cada oveja con su pareja", "translation": "Chacun à sa place, chacun à son rang."},
    {"language": "Anglais", "text": "A little bird is content with a little nest", "translation": "Un petit oiseau se contente d''un petit nid."},
    {"language": "Anglais", "text": "A wise man cares not for what he cannot have", "translation": "Un homme sage ne se préoccupe pas de ce qu''il ne peut posséder."}
  ]'::jsonb,
  3,
  57,
  'published'
),
(
  6,
  'mot-a-ne-te-tyele-mfek-eza-nte',
  'La sacoche d''autrui',
  'Môt a ne te tyelé mfek éza nté',
  'On n''accroche pas la sacoche à la taille de l''autre.',
  'L''autonomie et la responsabilité',
  'social',
  'Proverbe complémentaire cité par Maxime Meto''o pour illustrer que nul ne peut porter la responsabilité d''autrui ni se substituer à la mesure d''un autre homme. Chacun répond de sa propre charge et de ses actes au sein du clan.',
  '[
    {"language": "Français", "text": "À chacun son fardeau", "translation": "Chacun doit porter sa propre responsabilité."},
    {"language": "Espagnol", "text": "Cada cual con su costal", "translation": "Chacun avec son sac."}
  ]'::jsonb,
  3,
  58,
  'published'
),
(
  7,
  'bijo-bi-ebon-ojo-moyon-obaale-enjoe',
  'Lynx envers nos pareils',
  'Bijô bi ébon, ô jô moyoñ ô baale enjôé',
  'Reproches d’amant : tu blâmes ton frère alors que tu gardes toi-même une amante.',
  'L''hypocrisie et le miroir de soi',
  'social',
  'L''accent est mis ici sur les reproches qu''on fait à son alter ego pour avoir pris une amante, au moment même où on garde secrètement la sienne. Le proverbe châtie l''attitude hypocrite de celui qui condamne avec sévérité chez autrui le manquement qu''il s'autorise sans scrupule. Dans la vie communautaire, la lucidité envers soi-même précède toute leçon morale.',
  '[
    {"language": "Anglais", "text": "The counsel thou wouldst have another keep, first keep it thyself", "translation": "Le conseil que vous désirez qu''un autre applique, appliquez-le d''abord vous-même."},
    {"language": "Français (La Fontaine)", "text": "La Besace (I, 7)", "translation": "« Lynx envers nos pareils et taupes envers nous, / Nous nous pardonnons tout, et rien aux autres hommes. »"},
    {"language": "Français", "text": "Voir la paille dans l''œil du voisin et pas la poutre dans le nôtre", "translation": "Dénoncer les petits défauts d''autrui en oubliant les siens."},
    {"language": "Espagnol", "text": "Dijo el asno al mulo: « tira allá, orejudo »", "translation": "L''âne dit au mulet : « par ici, longues oreilles »."},
    {"language": "Anglais", "text": "The pot calls the kettle black", "translation": "La casserole insulte la noirceur de la théière."},
    {"language": "Arabe", "text": "The camel never sees its own hump, but that of its brother is always before its eyes", "translation": "Le chameau ne voit jamais sa propre bosse, mais celle de son frère est toujours devant ses yeux."},
    {"language": "Anglais", "text": "Those who live in glass houses should not throw stones", "translation": "Ceux qui vivent dans des maisons de verre ne doivent pas lancer des pierres."}
  ]'::jsonb,
  3,
  58,
  'published'
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  bulu = excluded.bulu,
  french = excluded.french,
  theme = excluded.theme,
  theme_category = excluded.theme_category,
  commentary = excluded.commentary,
  equivalents = excluded.equivalents,
  source_id = excluded.source_id,
  source_page = excluded.source_page,
  status = excluded.status;
