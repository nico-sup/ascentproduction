<template>
    <section v-editable="blok" class="hero">
        <div class="container hero-head">
            <h1 v-reveal class="hero-title">{{ blok.title }}</h1>
            <p v-if="blok.subtitle" class="hero-sub lede">{{ blok.subtitle }}</p>
        </div>

        <!-- Le cadre du viseur : il s'ouvre jusqu'au plein écran au défilement -->
        <div ref="frame" class="hero-frame">
            <video
              v-if="blok.asset?.filename"
              ref="video"
              class="hero-video"
              :poster="blok.poster?.filename ? sbImage(blok.poster.filename, '1600x0') : undefined"
              loop
              muted
              playsinline
              preload="none"
              aria-hidden="true"
              @playing="startTicker"
              @pause="stopTicker"
            ></video>

            <div class="viewfinder" aria-hidden="true"><span></span></div>

            <div class="hero-hud" aria-hidden="true">
                <span class="hero-rec"><i></i>REC</span>
                <span class="tabular-nums">{{ timecode }}</span>
            </div>

            <button type="button" class="hero-sound" @click="toggleSound"
                :aria-label="isMuted ? 'Activer le son de la vidéo' : 'Couper le son de la vidéo'">
                {{ isMuted ? 'Son coupé' : 'Son activé' }}
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({ blok: Object });
const { $gsap } = useNuxtApp();

const frame = ref(null);
const video = ref(null);
const isMuted = ref(true);
const timecode = ref('00:00:00:00');
let observer = null;
let tween = null;

const pad = (n) => String(Math.floor(n)).padStart(2, '0');

// Timecode façon caméra (25 images / seconde)
const onTime = () => {
    const t = video.value?.currentTime || 0;
    timecode.value = `${pad(t / 3600)}:${pad((t % 3600) / 60)}:${pad(t % 60)}:${pad((t % 1) * 25)}`;
};

// Le timecode défile image par image pendant la lecture
let raf = 0;
const startTicker = () => {
    cancelAnimationFrame(raf);
    const loop = () => { onTime(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
};
const stopTicker = () => cancelAnimationFrame(raf);

const toggleSound = () => {
    if (!video.value) return;
    isMuted.value = !isMuted.value;
    video.value.muted = isMuted.value;
};

// Démarre le téléchargement de la vidéo après l'affichage de la page (le titre s'affiche d'abord)
const startVideo = () => {
    const el = video.value;
    const src = props.blok.asset?.filename;
    if (!el || !src || el.getAttribute('src')) return;
    if (navigator.connection?.saveData) return;
    el.src = src;
    el.muted = true;
    el.play?.().catch(() => {});
};

const whenIdle = (fn) => ('requestIdleCallback' in window)
    ? window.requestIdleCallback(fn, { timeout: 2000 })
    : window.setTimeout(fn, 200);

onMounted(() => {
    if (document.readyState === 'complete') whenIdle(startVideo);
    else window.addEventListener('load', () => whenIdle(startVideo), { once: true });

    // Coupe le son quand la vidéo sort de l'écran
    if (video.value && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(([entry]) => {
            if (video.value) video.value.muted = entry.isIntersecting ? isMuted.value : true;
        }, { threshold: 0.1 });
        observer.observe(video.value);
    }

    // Ouverture du cadre au défilement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ($gsap && frame.value && !reduced) {
        tween = $gsap.fromTo(frame.value,
            { clipPath: 'inset(0% 4% 0% 4%)' },
            {
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'none',
                scrollTrigger: { trigger: frame.value, start: 'top 85%', end: 'top 10%', scrub: true },
            });
    }
});

onBeforeUnmount(() => {
    stopTicker();
    observer?.disconnect();
    tween?.scrollTrigger?.kill();
    tween?.kill();
});
</script>

<style scoped>
.hero {
    margin-top: 0;
}

.hero-head {
    padding-top: clamp(2.5rem, 8vh, 6rem);
    padding-bottom: clamp(2rem, 5vh, 3.5rem);
    display: grid;
    gap: 1.5rem;
    align-items: end;
}

@media (min-width: 768px) {
    .hero-head {
        grid-template-columns: minmax(0, 1fr) auto;
    }
}

.hero-title {
    margin: 0;
    font-size: clamp(3.4rem, 10.5vw, 11rem);
    line-height: 0.9;
    letter-spacing: -0.03em;
}

.hero-sub {
    margin: 0 0 0.6em;
    max-width: 22ch;
}

.hero-frame {
    position: relative;
    height: clamp(420px, 82vh, 900px);
    background: var(--basalt);
    overflow: hidden;
    clip-path: inset(0% 4% 0% 4%);
}

@media (max-width: 767px) {
    .hero-frame {
        height: 62vh;
        clip-path: inset(0% 5% 0% 5%);
    }
}

.hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-hud {
    position: absolute;
    left: clamp(28px, 6vw, 96px);
    bottom: clamp(26px, 3.5vw, 48px);
    z-index: 3;
    display: flex;
    gap: 1.25rem;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.92);
}

.hero-rec {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.hero-rec i {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--ember);
    animation: rec 1.6s steps(1) infinite;
}

@keyframes rec {
    50% { opacity: 0; }
}

.hero-sound {
    position: absolute;
    right: clamp(28px, 6vw, 96px);
    bottom: clamp(20px, 3vw, 42px);
    z-index: 3;
    font-size: 0.8rem;
    color: var(--white);
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 999px;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.hero-sound:hover {
    background: var(--white);
    color: var(--basalt);
}
</style>
