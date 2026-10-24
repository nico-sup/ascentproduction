<template>
    <div v-if="enabled" ref="el" class="app-cursor" :class="{ 'is-view': mode === 'view', 'is-hidden': hidden }" aria-hidden="true">
        <span class="app-cursor-label">Voir</span>
    </div>
</template>

<script setup>
// Curseur : petit point orange qui suit la souris et devient « Voir » au survol des projets.
// Uniquement sur ordinateur (souris) et si les animations ne sont pas réduites.
import { ref, onMounted, onBeforeUnmount } from 'vue'

const VIEW_TARGETS = '[data-cursor="view"], .article-card, .category-item, .category-split.has-link, .mansory button'

const el = ref(null)
const enabled = ref(false)
const mode = ref('default')
const hidden = ref(true)

let x = 0, y = 0, cx = 0, cy = 0, raf = 0

const onMove = (e) => {
    x = e.clientX
    y = e.clientY
    if (hidden.value) { cx = x; cy = y; hidden.value = false }
    const target = e.target instanceof Element ? e.target : null
    mode.value = target?.closest(VIEW_TARGETS) ? 'view' : 'default'
}

const onLeave = () => { hidden.value = true }

const tick = () => {
    cx += (x - cx) * 0.2
    cy += (y - cy) * 0.2
    if (el.value) el.value.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
    raf = requestAnimationFrame(tick)
}

onMounted(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    enabled.value = true
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMove)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    cancelAnimationFrame(raf)
})
</script>

<style>
.app-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 999px;
    background: var(--ember);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.45s var(--ease-out), height 0.45s var(--ease-out), margin 0.45s var(--ease-out),
        background-color 0.45s ease, opacity 0.3s ease;
}

.app-cursor.is-hidden {
    opacity: 0;
}

.app-cursor-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--paper);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.app-cursor.is-view {
    width: 84px;
    height: 84px;
    margin: -42px 0 0 -42px;
    background: var(--moss);
}

.app-cursor.is-view .app-cursor-label {
    opacity: 1;
}
</style>
