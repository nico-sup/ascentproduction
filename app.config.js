// Informations de l'entreprise, utilisées partout (pied de page, données structurées, SEO).
// Modifie-les ici : tout le site se met à jour.
export default defineAppConfig({
  site: {
    name: 'Ascent Production',
    alternateName: 'Ascent Prod',
    url: 'https://ascentproduction.fr',
    defaultTitle: 'Ascent Production – Production audiovisuelle, vidéo & drone à Clermont-Ferrand',
    // ~155 caractères max : c'est la description affichée par Google
    description:
      "Production audiovisuelle à Clermont-Ferrand (Auvergne) : films d'entreprise, publicité, événementiel, drone, photo, montage et sites web. Partout en France.",
    ogImage: '/images/logo-ascent-1200.png',
    logo: '/images/logo-ascent-1200.png',

    phone: '06 44 05 69 92',
    phoneIntl: '+33644056992',
    email: 'ascent.audiovisuel@gmail.com',

    city: 'Clermont-Ferrand',
    postalCode: '63000',
    department: 'Puy-de-Dôme',
    region: 'Auvergne-Rhône-Alpes',
    country: 'FR',
    // Coordonnées du centre de Clermont-Ferrand (pas d'adresse précise publiée)
    geo: { latitude: 45.7772, longitude: 3.087 },

    services: [
      { name: 'Production vidéo', description: "Films d'entreprise, vidéos institutionnelles, publicités et contenus pour les réseaux sociaux." },
      { name: 'Captation événementielle', description: 'Tournage de vos événements, conférences, salons et spectacles.' },
      { name: 'Prises de vue aériennes par drone', description: 'Images aériennes et drone FPV pour vos vidéos et photos.' },
      { name: 'Photographie professionnelle', description: "Photos d'entreprise, de produits, d'événements et de lieux." },
      { name: 'Montage et post-production', description: 'Montage, étalonnage, habillage graphique et sound design.' },
      { name: 'Podcast', description: 'Enregistrement et production de podcasts audio et vidéo.' },
      { name: 'Création de sites internet', description: 'Sites vitrines sur mesure, rapides et optimisés pour le référencement.' },
    ],

    // Renseigne tes liens (laisser vide = icône masquée)
    socials: {
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      vimeo: '',
    },

    calendly: {
      url: 'https://calendly.com/ascent-audiovisuel/parlons-de-votre-projet',
      text: 'On se rencontre ?',
      color: '#8aba9c',
      textColor: '#ffffff',
    },
  },
})
