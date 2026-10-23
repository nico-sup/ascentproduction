# ascentproduction.fr

Site d'Ascent Production, société de production audiovisuelle à Clermont-Ferrand.
Nuxt 3 + Storyblok (CMS) + Tailwind, pré-généré en HTML statique et hébergé sur Netlify.

## Démarrer en local

```bash
cp .env.example .env   # puis renseigner STORYBLOK_TOKEN
npm install
npm run dev            # http://localhost:3000
npm run generate       # génère le site statique dans .output/public
npx serve .output/public   # prévisualiser le site généré
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `STORYBLOK_TOKEN` | Jeton Storyblok. **Production : jeton « Public »** (Settings → Access tokens). Le jeton « Preview » donne accès aux brouillons et ne doit pas être utilisé en production. |
| `STORYBLOK_VERSION` | `published` (défaut) ou `draft` pour un déploiement de prévisualisation. |

Sur Netlify : *Site configuration → Environment variables*. Le build (`npm run generate`) et le dossier publié (`.output/public`) sont définis dans `netlify.toml`.

> Le site étant pré-généré, **chaque publication dans Storyblok nécessite un nouveau build**.
> Crée un *Build hook* dans Netlify et ajoute-le comme *Webhook* « Story published » dans Storyblok.

## Informations de l'entreprise

Téléphone, e-mail, services, réseaux sociaux, Calendly : tout est dans **`app.config.js`**.
Ces informations alimentent le pied de page et les données structurées (schema.org) lues par Google et les moteurs IA.

## SEO

- Chaque page a son titre, sa description, son image de partage et son URL canonique (`composables/useStorySeo.js`).
- Champs Storyblok reconnus pour personnaliser une page : `seo_title`, `seo_description`, `og_image` (ou le champ du plugin SEO Storyblok nommé `seo`). Sinon : `title`, `description`, `image` du contenu.
- Données structurées : entreprise locale (`app.vue`), page + fil d'Ariane (toutes les pages), FAQ (bloc `faq`).
- `sitemap.xml` généré automatiquement, `robots.txt` et `llms.txt` dans `public/`.

## Bloc FAQ (Storyblok)

À créer dans *Block library* :

- `faq` (bloc imbriquable) : `title` (Text), `items` (Blocks, autorise uniquement `faq_item`)
- `faq_item` : `question` (Text), `answer` (Richtext ou Textarea)

Les questions apparaissent sur la page et dans les données structurées `FAQPage`.
