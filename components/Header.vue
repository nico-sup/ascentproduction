<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'is-tucked': tucked && !isActive, 'is-open': isActive }">
    <nav class="container site-header-bar" aria-label="Navigation principale">
      <NuxtLink to="/" class="site-logo" aria-label="Ascent Production – accueil" @click="closeMenu">
        <img src="/images/logo-ascent.webp" width="200" height="40"
          alt="Ascent Production, production audiovisuelle à Clermont-Ferrand" fetchpriority="high">
      </NuxtLink>

      <div class="flex items-center gap-6 md:gap-10">
        <NuxtLink to="/nos-tarifs" class="hidden md:inline text-sm link-line">Tarifs</NuxtLink>
        <NuxtLink to="/contact" class="hidden md:inline text-sm link-line">Contact</NuxtLink>
        <button type="button" class="menu-toggle" @click="toggleHeaderActive"
          :aria-label="isActive ? 'Fermer le menu' : 'Ouvrir le menu'" :aria-expanded="isActive" aria-controls="menu-principal">
          <span class="text-sm">{{ isActive ? 'Fermer' : 'Menu' }}</span>
          <span class="menu-toggle-icon" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
    </nav>

    <div id="menu-principal" class="menu-overlay" :class="{ 'is-open': isActive }" data-lenis-prevent
      :aria-hidden="!isActive" :inert="!isActive">
      <div class="container menu-overlay-inner">
        <ul class="menu-links">
          <li v-for="(item, i) in menu" :key="item.to" :style="{ '--i': i }">
            <NuxtLink :to="item.to" @click="closeMenu"><span>{{ item.label }}</span></NuxtLink>
          </li>
        </ul>

        <div class="menu-aside">
          <p class="text-sm m-0" style="color: var(--grey-ascent)">Basé à Clermont-Ferrand, disponible partout en France</p>
          <a :href="`mailto:${site.email}`" class="block mt-4 link-line w-fit">{{ site.email }}</a>
          <a :href="`tel:${site.phoneIntl}`" class="block mt-2 link-line w-fit">{{ site.phone }}</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const site = useAppConfig().site;
const nuxtApp = useNuxtApp();

const isActive = ref(false);
const scrolled = ref(false);
const tucked = ref(false);
let lastY = 0;

const menu = [
  { to: '/', label: 'Accueil' },
  { to: '/projects', label: 'Nos réalisations' },
  { to: '/nos-expertises', label: 'Nos expertises' },
  { to: '/production-audiovisuelle', label: 'Production audiovisuelle' },
  { to: '/site-internet', label: 'Création de site internet' },
  { to: '/nos-tarifs', label: 'Nos tarifs' },
  { to: '/contact', label: 'Contact' },
];

function toggleHeaderActive() {
  isActive.value = !isActive.value;
}

function closeMenu() {
  isActive.value = false;
}

// Le menu plein écran bloque le défilement de la page
watch(isActive, (open) => {
  const lenis = nuxtApp.$lenis;
  if (open) lenis ? lenis.stop() : (document.documentElement.style.overflow = 'hidden');
  else lenis ? lenis.start() : (document.documentElement.style.overflow = '');
});

// En-tête : fond après le début du défilement, se range quand on descend, revient quand on remonte
const onScroll = () => {
  const y = window.scrollY;
  scrolled.value = y > 8;
  tucked.value = y > 400 && y > lastY;
  lastY = y;
};

const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKey);
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('keydown', onKey);
});
</script>
