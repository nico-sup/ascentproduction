<template>
    <section v-editable="blok" class="studio-teaser container">
        <NuxtLink :to="to" class="studio-teaser-frame" :aria-label="`${title} ${titleItalic} – ${cta}`">
            <img :src="`/images/studio/studio-${phase}.webp`" width="1600" height="900" alt="" loading="lazy" decoding="async" class="studio-teaser-img">
            <span class="studio-teaser-veil" aria-hidden="true"></span>
            <span class="viewfinder" aria-hidden="true"><span></span></span>

            <span class="studio-teaser-top">
                <span class="studio-teaser-rec"><i aria-hidden="true"></i>{{ clock }}</span>
                <span class="studio-teaser-badge">{{ blok.badge || 'Nouveau' }}</span>
            </span>

            <span class="studio-teaser-body">
                <span class="eyebrow">{{ blok.eyebrow || 'Studio immersif · 3D' }}</span>
                <span class="studio-teaser-title" role="heading" aria-level="2">
                    {{ title }}<br><em>{{ titleItalic }}</em>
                </span>
                <span class="studio-teaser-text">{{ text }}</span>
                <span class="studio-teaser-cta">
                    <span class="studio-teaser-play" aria-hidden="true"></span>
                    {{ cta }}
                </span>
            </span>
        </NuxtLink>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ blok: { type: Object, default: () => ({}) } })

const title = computed(() => props.blok.title || 'Entrez dans le studio,')
const titleItalic = computed(() => props.blok.title_italic || 'naviguez d’île en île')
const text = computed(() => props.blok.text || 'Un archipel en 3D où chaque île cache un de nos films. La lumière suit l’heure réelle : venez de jour, revenez de nuit.')
const cta = computed(() => props.blok.cta_label || 'Explorer le studio')
const to = computed(() => resolveSbLink(props.blok.link).to || '/studio')

// Image et horloge selon l'heure du visiteur (même logique que la scène 3D)
const phase = ref('coucher')
const clock = ref('Studio')
let timer = 0
onMounted(async () => {
    const { sunPosition } = await import('~/lib/studio/sun.js')
    const update = () => {
        const now = new Date()
        const { elevation } = sunPosition(now)
        phase.value = elevation < -6 ? 'nuit' : elevation < 10 ? 'coucher' : 'jour'
        const label = { nuit: 'nuit étoilée sur l’archipel', coucher: 'coucher de soleil sur l’archipel', jour: 'grand jour sur l’archipel' }[phase.value]
        if (phase.value === 'coucher' && elevation >= -6 && now.getHours() < 12) clock.value = `${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · aube sur l’archipel`
        else clock.value = `${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · ${label}`
    }
    update()
    timer = setInterval(update, 60000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>
