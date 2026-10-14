
# Akeñ — Dictionnaire bulu–français

Une application web et mobile (PWA) pour consulter, comprendre et transmettre la langue bulu, une langue bantoue du Cameroun.

> **Statut : en développement.** Le projet n'est pas encore public. Rien de ce qui est décrit ci-dessous n'est garanti disponible tant que la case n'est pas cochée.

## Pourquoi ce projet

Le bulu est une langue à tons, peu présente sur le web et mal servie par les outils numériques. Les ouvrages de référence existent, mais ils sont difficiles à consulter, à rechercher et à partager. Akeñ veut rendre ces savoirs accessibles, avec les auteurs mis en avant, et ouvrir un espace où la communauté peut les enrichir sans les altérer.

## Pour qui

- les apprenants et les membres de la diaspora qui veulent comprendre un mot ;
- les locuteurs qui cherchent une orthographe, un sens ou une expression ;
- les curieux et chercheurs intéressés par l'histoire de la langue et du peuple bulu.

## Fonctionnalités

- [ ] Recherche de mots tolérante aux accents, aux tons et aux fautes de frappe
- [ ] Fiche de mot : tons, classe nominale, pluriel, transcription phonétique, définitions, exemples, renvois
- [ ] Comptes utilisateurs, favoris et historique de recherche
- [ ] Notes éditoriales rédigées et modifiables par un administrateur
- [ ] Commentaires des utilisateurs sur chaque mot ou expression, avec modération
- [ ] Mot du jour et histoire du jour
- [ ] Traduction assistée, limitée aux entrées du dictionnaire (RAG)
- [ ] Mode hors connexion et installation sur téléphone

## Technologies

| Rôle | Outil |
|---|---|
| Application | Next.js (App Router), TypeScript |
| Style | Tailwind CSS |
| Base de données et authentification | Supabase (PostgreSQL), sécurité par rôles (Row Level Security) |
| Traduction assistée (prévu) | pgvector + API Claude |
| Hébergement (prévu) | Vercel |

## Démarrer en local

Prérequis : Node.js 20 ou plus récent, Git, un projet Supabase.

```bash
git clone <URL_DU_DEPOT>
cd bulu-app
npm install
```

Créer un fichier `.env.local` à la racine (ne jamais le publier) :

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Créer les tables en exécutant `supabase/schema.sql` dans l'éditeur SQL de Supabase, puis lancer l'application :

```bash
npm run dev
```

## Structure du dépôt

```
app/             pages et routes
components/      composants d'interface
lib/             accès à la base de données, utilitaires
data/processed/  données extraites des ouvrages (JSON)
scripts/         extraction et import des données
supabase/        schéma de la base de données
docs/            cahier des charges, décisions
```

## Sources et auteurs

Les contenus linguistiques viennent d'ouvrages publiés. Chaque mot, expression ou récit est rattaché à sa source et à sa page.

- Marie-Rose Abomo-Maurin, *Parlons boulou : langue bantou du Cameroun*, L'Harmattan, Paris, 2006.
- Dictionnaire bulu–français : référence en cours de vérification. Le nom des auteurs sera ajouté dès confirmation.

Ces ouvrages sont protégés par le droit d'auteur. Leur contenu n'est publié qu'avec l'autorisation des ayants droit ; en attendant, les données sont importées en brouillon et ne sont pas visibles du public.

## Feuille de route

0. Cadrage et installation de l'environnement
1. Extraction et vérification des données
2. Interface (d'après la maquette)
3. Base de données et comptes
4. Mot du jour et histoire du jour
5. Traduction assistée
6. Mode hors connexion et mise en production

## Licence

À définir. Le code et les contenus linguistiques relèveront de licences distinctes : les données restent la propriété de leurs auteurs et éditeurs.
