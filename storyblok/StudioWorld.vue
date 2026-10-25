<template>
    <section v-editable="blok" class="studio" :class="{ 'is-ready': ready, 'is-fallback': fallback, 'is-list': showList }">
        <canvas ref="canvas" class="studio-canvas" aria-hidden="true"
            @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp"></canvas>

        <div class="studio-shade" aria-hidden="true"></div>

        <!-- Titre -->
        <div class="studio-hero">
            <p class="studio-clock" aria-live="polite"><i aria-hidden="true"></i>{{ clockLabel }}</p>
            <h1 class="studio-title">
                {{ blok.title || 'Le studio,' }}<br>
                <em v-if="blok.title_italic">{{ blok.title_italic }}</em>
            </h1>
            <p v-if="blok.intro" class="studio-intro">{{ blok.intro }}</p>
        </div>

        <!-- Commandes -->
        <div class="studio-controls">
            <div class="studio-nav" role="group" aria-label="Navigation dans l'archipel">
                <button type="button" class="studio-btn" aria-label="Île précédente" @click="go(-1)">←</button>
                <button type="button" class="studio-btn is-text" @click="goHome">Port</button>
                <button type="button" class="studio-btn" aria-label="Île suivante" @click="go(1)">→</button>
                <button type="button" class="studio-btn is-text" :aria-expanded="showList" aria-controls="studio-list" @click="showList = !showList">
                    {{ showList ? 'Fermer' : 'Liste' }}
                </button>
                <button v-if="ready && !fallback" type="button" class="studio-btn studio-sound" :class="{ 'is-on': soundOn }"
                    :aria-pressed="soundOn" :aria-label="soundOn ? 'Couper le son' : 'Activer le son'" @click="toggleSound">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
                        <template v-if="soundOn"><path d="M16 9.5a3.5 3.5 0 0 1 0 5" /><path d="M18.5 7a7 7 0 0 1 0 10" /></template>
                        <path v-else d="M17 9l5 6M22 9l-5 6" />
                    </svg>
                    <span class="studio-sound-bars" aria-hidden="true"><i></i><i></i><i></i></span>
                </button>
            </div>
            <p v-if="ready && !fallback" class="studio-hint">{{ hint }}</p>
        </div>

        <!-- Invitation à activer le son si le navigateur l'a bloqué -->
        <transition name="studio-card">
            <button v-if="needsTap && soundOn" type="button" class="studio-tap" @click="onFirstGesture()">
                <span class="studio-sound-bars is-anim" aria-hidden="true"><i></i><i></i><i></i></span>
                {{ touch ? 'Touchez l’écran pour le son' : 'Cliquez pour activer le son' }}
            </button>
        </transition>

        <!-- Joystick (écrans tactiles) -->
        <div v-if="touch && ready && !fallback" ref="stick" class="studio-stick" aria-hidden="true"
            @pointerdown.stop="stickDown" @pointermove.stop="stickMove" @pointerup.stop="stickUp" @pointercancel.stop="stickUp">
            <span :style="{ transform: `translate(${knob.x}px, ${knob.y}px)` }"></span>
        </div>

        <!-- Carte de l'île active -->
        <transition name="studio-card">
            <article v-if="active" :key="active.uid" class="studio-card">
                <div ref="videoHolder" class="studio-card-media">
                    <img v-if="active.poster && !hasVideo" :src="sbImage(active.poster, '400x0')" alt="" loading="lazy">
                </div>
                <div class="studio-card-body">
                    <small>{{ active.tag || 'Extrait' }}</small>
                    <h2>{{ active.title }}</h2>
                    <p v-if="active.description">{{ active.description }}</p>
                    <NuxtLink v-if="active.link.to && !active.link.external" :to="active.link.to" class="link-line">{{ active.linkLabel || 'Voir le projet' }} →</NuxtLink>
                    <a v-else-if="active.link.to" :href="active.link.to" target="_blank" rel="noopener" class="link-line">{{ active.linkLabel || 'Voir le projet' }} →</a>
                </div>
            </article>
        </transition>

        <!-- Liste des îles : accessible, lue par Google, et affichée si la 3D n'est pas disponible -->
        <nav id="studio-list" class="studio-list" aria-label="Liste des îles">
            <ol>
                <li v-for="(isl, i) in items" :key="isl.uid">
                    <button type="button" class="studio-list-item" @click="selectFromList(i)">
                        <span class="studio-list-num">{{ String(i + 1).padStart(2, '0') }}</span>
                        <span>
                            <strong>{{ isl.title }}</strong>
                            <span v-if="isl.description" class="block">{{ isl.description }}</span>
                        </span>
                    </button>
                    <NuxtLink v-if="isl.link.to && !isl.link.external" :to="isl.link.to" class="link-line text-sm">{{ isl.linkLabel || 'Voir le projet' }}</NuxtLink>
                </li>
            </ol>
        </nav>
    </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({ blok: { type: Object, required: true } })
const route = useRoute()

useHead({ htmlAttrs: { class: 'is-studio' } })

const items = computed(() => (props.blok.islands || []).map((i) => ({
    uid: i._uid,
    title: i.title || 'Extrait',
    tag: i.tag,
    description: i.description,
    video: i.video?.filename || '',
    poster: i.poster?.filename || '',
    color: i.color || 'coucher',
    link: resolveSbLink(i.link),
    linkLabel: i.link_label,
})))

const canvas = ref(null)
const videoHolder = ref(null)
const stick = ref(null)
const ready = ref(false)
const fallback = ref(false)
const showList = ref(false)
const touch = ref(false)
const activeIdx = ref(-1)
const hasVideo = ref(false)
const mood = ref({ label: '', night: 0 })
const soundOn = ref(false)
const now = ref(new Date())
const knob = ref({ x: 0, y: 0 })
const isMounted = ref(false) // l'heure n'est affichée qu'une fois dans le navigateur (évite un écart avec le HTML pré-généré)

const active = computed(() => (activeIdx.value >= 0 ? items.value[activeIdx.value] : null))
const hint = computed(() => (touch.value ? 'Joystick pour naviguer · Touche une île' : 'Fais glisser pour regarder · Flèches pour avancer · Clique une île'))
const clockLabel = computed(() => {
    if (!isMounted.value) return 'Studio'
    const h = route.query.heure
    const t = h != null ? `${String(Math.floor(+h)).padStart(2, '0')}:${String(Math.round((+h % 1) * 60)).padStart(2, '0')}` : now.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return mood.value.label ? `${t} · ${mood.value.label}` : t
})

let world = null
let io = null, ro = null, clockTimer = null
let currentVideo = null

function attachVideo(el) {
    currentVideo = el
    hasVideo.value = !!el
    nextTick(() => {
        if (!videoHolder.value) return
        if (el) { el.className = 'studio-card-video'; videoHolder.value.prepend(el); el.play().catch(() => {}) }
    })
}

// ----- Pointeur : glisser pour regarder, clic/tap pour choisir une île -----
let down = null
function onDown(e) {
    if (!world) return
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: 0, type: e.pointerType }
    if (e.pointerType === 'mouse') canvas.value.setPointerCapture(e.pointerId)
}
function onMove(e) {
    if (!down || !world) return
    const dx = e.clientX - down.lx, dy = e.clientY - down.ly
    down.lx = e.clientX; down.ly = e.clientY
    down.moved += Math.abs(dx) + Math.abs(dy)
    if (down.type === 'mouse') world.look(-dx, dy)
    else if (Math.abs(dx) > Math.abs(dy)) world.look(-dx * 1.3, 0) // tactile : glissé horizontal = tourner (le vertical fait défiler la page)
}
function onUp(e) {
    if (!down || !world) { down = null; return }
    if (down.moved < 8) {
        const hit = world.pick(e.clientX, e.clientY)
        if (hit != null) world.flyTo(hit)
    }
    down = null
}

// ----- Joystick -----
let stickState = null
function stickDown(e) {
    stick.value.setPointerCapture(e.pointerId)
    const r = stick.value.getBoundingClientRect()
    stickState = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, max: r.width / 2 - 8 }
    stickMove(e)
}
function stickMove(e) {
    if (!stickState || !world) return
    let dx = e.clientX - stickState.cx, dy = e.clientY - stickState.cy
    const d = Math.hypot(dx, dy), m = stickState.max
    if (d > m) { dx = (dx / d) * m; dy = (dy / d) * m }
    knob.value = { x: dx, y: dy }
    world.nav.flight = null
    world.nav.input.forward = Math.abs(dy) > 6 ? -dy / m : 0
    world.nav.input.turn = Math.abs(dx) > 6 ? dx / m : 0
}
function stickUp() {
    stickState = null
    knob.value = { x: 0, y: 0 }
    if (world) { world.nav.input.forward = 0; world.nav.input.turn = 0 }
}

// ----- Clavier -----
const keys = new Set()
function updateKeys() {
    if (!world) return
    const f = (keys.has('ArrowUp') || keys.has('KeyW') || keys.has('KeyZ') ? 1 : 0) - (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0)
    const t = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') || keys.has('KeyQ') ? 1 : 0)
    world.nav.input.forward = f; world.nav.input.turn = t
    if (f || t) world.nav.flight = null
}
let inView = false
function onKey(e) {
    if (!inView || e.target.closest?.('input, textarea, select, [contenteditable]')) return
    const codes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyZ', 'KeyS', 'KeyA', 'KeyQ', 'KeyD']
    if (!codes.includes(e.code)) return
    if (e.type === 'keydown') { keys.add(e.code); if (e.code.startsWith('Arrow')) e.preventDefault() } else keys.delete(e.code)
    updateKeys()
}

// ----- Navigation par boutons -----
function go(step) {
    if (!world || !items.value.length) return
    const n = items.value.length
    const base = activeIdx.value >= 0 ? activeIdx.value : (step > 0 ? -1 : 0)
    world.flyTo(((base + step) % n + n) % n)
}
function goHome() { world?.flyTo(-1) }
function selectFromList(i) {
    showList.value = false
    if (world) world.flyTo(i)
}

// ----- Son d'ambiance : lancé automatiquement à l'arrivée -----
// Les navigateurs n'autorisent le son qu'après un geste du visiteur. Si on arrive depuis un lien
// du site (accueil, menu…), le son a été débloqué au clic et démarre tout seul. Sinon, il démarre
// au premier toucher / clic / touche, avec une petite invitation à l'écran.
let ambience = null
let ambienceMod = null
const needsTap = ref(false)
function soundPref() { try { return localStorage.getItem('studio-sound') || 'on' } catch (e) { return 'on' } }
function savePref(on) { try { localStorage.setItem('studio-sound', on ? 'on' : 'off') } catch (e) { /* stockage indisponible */ } }
function ensureAmbience() {
    if (!ambience && ambienceMod) { ambience = ambienceMod.getAmbience(); ambience?.setNight(mood.value.night || 0) }
    return ambience
}
function onFirstGesture(e) {
    if (e?.target?.closest?.('.studio-sound')) return // le bouton son gère lui-même
    const a = ensureAmbience(); if (!a) return
    disarmGesture()
    needsTap.value = false
    if (!soundOn.value) return
    a.prime()
    a.start()
    if (!inView || document.hidden) a.stop()
}
const gestureEvents = ['touchend', 'click', 'keydown']
function armGesture() { gestureEvents.forEach((ev) => window.addEventListener(ev, onFirstGesture, { capture: true, passive: true })) }
function disarmGesture() { gestureEvents.forEach((ev) => window.removeEventListener(ev, onFirstGesture, { capture: true })) }

async function autoStartSound() {
    try { ambienceMod = await import('~/lib/studio/ambience.js') } catch (e) { return }
    if (soundPref() === 'off') return
    const a = ensureAmbience(); if (!a) return
    soundOn.value = true
    a.start()
    // Laisse au navigateur le temps de répondre : si le son reste bloqué, on attend un geste
    setTimeout(() => {
        if (soundOn.value && a.state !== 'running') { needsTap.value = true; armGesture() }
    }, 500)
}
function toggleSound() {
    const a = ensureAmbience()
    if (!a) return
    soundOn.value = !soundOn.value
    needsTap.value = false
    disarmGesture()
    if (soundOn.value) { a.prime(); a.start(); if (!inView || document.hidden) a.stop() } else a.stop()
    savePref(soundOn.value)
}

function webglOk() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch (e) { return false }
}

onMounted(async () => {
    isMounted.value = true
    touch.value = window.matchMedia('(pointer: coarse)').matches
    if (!webglOk()) { fallback.value = true; showList.value = true; return }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = touch.value || window.innerWidth < 768
    const hour = route.query.heure != null && !Number.isNaN(+route.query.heure) ? +route.query.heure : null
    try {
        const { createWorld } = await import('~/lib/studio/world.js')
        world = await createWorld(canvas.value, {
            islands: items.value,
            mobile, reduced, hour,
            onActive: (idx, el) => {
                if (currentVideo && currentVideo !== el) currentVideo.remove()
                activeIdx.value = idx
                attachVideo(idx >= 0 ? el : null)
            },
            onMood: (m) => { mood.value = m; ambience?.setNight(m.night) },
        })
    } catch (e) {
        console.error(e)
        fallback.value = true; showList.value = true
        return
    }
    ready.value = true
    world.resize()
    ro = new ResizeObserver(() => world?.resize()); ro.observe(canvas.value)
    io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        if (inView && !document.hidden) world.start(); else world.stop()
        if (ambience && soundOn.value) { if (inView && !document.hidden) ambience.start(); else ambience.stop() }
    }, { threshold: 0.05 })
    io.observe(canvas.value)
    document.addEventListener('visibilitychange', onVisibility)
    autoStartSound()
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    clockTimer = setInterval(() => { now.value = new Date() }, 30000)
})

function onVisibility() {
    if (!world) return
    if (document.hidden) world.stop(); else if (inView) world.start()
    if (ambience && soundOn.value) { if (document.hidden || !inView) ambience.stop(); else ambience.start() }
}

// Éditeur visuel Storyblok : l'archipel se met à jour quand on ajoute ou modifie une île
// (on ne reconstruit la scène que si une île est ajoutée, retirée, renommée, recolorée ou change de vidéo)
const structure = computed(() => items.value.map((i) => [i.uid, i.title, i.color, i.video].join('|')).join('~'))
watch(structure, () => {
    if (!world) return
    currentVideo?.remove()
    world.setIslands(items.value)
    activeIdx.value = -1
    attachVideo(null)
})

onBeforeUnmount(() => {
    io?.disconnect(); ro?.disconnect(); clearInterval(clockTimer)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('keyup', onKey)
    currentVideo?.remove()
    world?.dispose(); world = null
    disarmGesture()
    ambience?.stop(); ambience = null
})
</script>
