<template>
    <footer class="border-t pt-11 border-t-green-light-ascent">
        <div class="grid md:grid-cols-2 gap-y-8 lg:grid-cols-4 container pb-11">

            <div>
                <NuxtLink to="/" aria-label="Ascent Production – accueil">
                    <img src="/images/logo-ascent.webp" class="mb-6 block max-w-48 h-auto" width="192" height="38"
                        alt="Logo Ascent Production" loading="lazy" decoding="async">
                </NuxtLink>
                <!-- Présentation factuelle : utile aux visiteurs, à Google et aux moteurs IA -->
                <p class="text-sm max-w-xs">
                    Ascent Production est une société de production audiovisuelle basée à Clermont-Ferrand,
                    en Auvergne : films d'entreprise, publicité, événementiel, drone, photographie,
                    montage et création de sites internet. Interventions partout en France.
                </p>
                <ul v-if="socialLinks.length" class="flex gap-4">
                    <li v-for="s in socialLinks" :key="s.key">
                        <a :href="s.url" target="_blank" rel="noopener me" :aria-label="`${site.name} sur ${s.label}`"
                            class="block p-2 before:hidden">
                            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="#27292F">
                                <path :d="s.icon" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <p class="footer-title">{{ site.name }}</p>
                <address class="not-italic">
                    <p class="my-0">Production audiovisuelle</p>
                    <p class="my-0">{{ site.postalCode }} {{ site.city }}, {{ site.department }}</p>
                    <p class="mt-0">Auvergne · Déplacements dans toute la France</p>
                    <a class="block text-green-light-ascent" :href="`tel:${site.phoneIntl}`">{{ site.phone }}</a>
                    <a class="block text-green-light-ascent" :href="`mailto:${site.email}`">{{ site.email }}</a>
                </address>
            </div>

            <nav aria-label="Liens du pied de page">
                <p class="footer-title">Navigation</p>
                <ul>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/">Accueil</NuxtLink></li>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/projects">Nos réalisations</NuxtLink></li>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/nos-expertises">Nos expertises</NuxtLink></li>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/production-audiovisuelle">Production audiovisuelle</NuxtLink></li>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/site-internet">Création de site internet</NuxtLink></li>
                    <li><NuxtLink class="hover:text-green-light-ascent" to="/contact">Contact</NuxtLink></li>
                </ul>
            </nav>

            <div>
                <p class="footer-title">Un projet vidéo ?</p>
                <NuxtLink class="button" to="/contact">Demander un devis</NuxtLink>
            </div>

        </div>

        <div class="border-t border-r-green-light-ascent">
            <ul class="container flex flex-wrap justify-center items-center gap-x-10 gap-y-2 py-2">
                <li>
                    <p class="before:hidden">© {{ year }} {{ site.name }}</p>
                </li>
                <li>
                    <NuxtLink to="/politique-de-confidentialite">Politique de confidentialité</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/mentions-legales">Mentions légales</NuxtLink>
                </li>
            </ul>
        </div>
    </footer>

    <button v-show="showFloating" type="button" @click="goToTop" aria-label="Revenir en haut de la page"
        class="fixed bg-white right-6 bottom-6 border border-grey-ascent p-4 z-[2] rounded-xl">
        <svg width="16" height="16" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M34.4086 18.3646C35.4501 17.3232 35.4501 15.635 34.4086 14.5934L21.3627 1.56024C19.2795 -0.5208 15.9041 -0.519973 13.8222 1.56208L0.781117 14.603C-0.260217 15.6446 -0.260217 17.3328 0.781117 18.3744C1.82245 19.4158 3.51098 19.4158 4.55232 18.3744L15.7142 7.21256C16.7555 6.17117 18.4438 6.17117 19.4854 7.21256L30.6374 18.3646C31.6788 19.4062 33.3673 19.4062 34.4086 18.3646Z" fill="#27292F"/>
        </svg>
    </button>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const site = useAppConfig().site;
const year = new Date().getFullYear();

const ICONS = {
    instagram: { label: 'Instagram', icon: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z' },
    facebook: { label: 'Facebook', icon: 'M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z' },
    linkedin: { label: 'LinkedIn', icon: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z' },
    youtube: { label: 'YouTube', icon: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z' },
    vimeo: { label: 'Vimeo', icon: 'M23.98 6.4c-.1 2.3-1.7 5.5-4.9 9.6-3.3 4.3-6.1 6.4-8.4 6.4-1.4 0-2.6-1.3-3.6-4l-2-7.3C4.4 8.5 3.6 7.2 2.8 7.2c-.2 0-.8.4-1.9 1.1L0 7.2l3.5-3.1C5.1 2.7 6.3 2 7.1 1.9c1.9-.2 3 1.1 3.5 3.8.5 3 .8 4.8 1 5.5.5 2.4 1.1 3.6 1.8 3.6.5 0 1.3-.8 2.3-2.4 1-1.6 1.6-2.8 1.7-3.7.1-1.4-.4-2-1.7-2-.6 0-1.2.1-1.8.4 1.2-3.9 3.5-5.8 6.9-5.7 2.5.1 3.7 1.7 3.6 4.9z' },
};

const socialLinks = computed(() =>
    Object.entries(site.socials || {})
        .filter(([key, url]) => url && ICONS[key])
        .map(([key, url]) => ({ key, url, ...ICONS[key] }))
);

const showFloating = ref(false);

function handleScroll() {
    showFloating.value = window.scrollY >= window.innerHeight;
    // Le badge Calendly suit le même affichage (voir _variables.scss)
    document.documentElement.classList.toggle('show-floating', showFloating.value);
}

function goToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
