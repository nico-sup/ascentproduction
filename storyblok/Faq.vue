<template>
    <section v-editable="blok" class="container faq">
        <h2 v-if="blok.title" v-reveal class="mb-10 max-w-[18ch]">{{ blok.title }}</h2>
        <div class="faq-list">
            <details v-for="item in items" :key="item._uid" v-editable="item" class="faq-item">
                <summary>{{ item.question }}</summary>
                <div class="faq-answer" v-html="item.html"></div>
            </details>
        </div>
    </section>
</template>

<script setup>
// Bloc FAQ Storyblok (nom technique : "faq")
//   - title    : Texte
//   - items    : Blocs, composant "faq_item"
//        - question : Texte
//        - answer   : Richtext (ou Textarea)
// Génère aussi les données structurées FAQPage, très utilisées par Google et les moteurs IA.
const props = defineProps({ blok: Object })

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const items = computed(() =>
    (props.blok.items || [])
        .filter(i => i.question && i.answer)
        .map(i => ({
            ...i,
            html: typeof i.answer === 'string'
                ? escapeHtml(i.answer).replace(/\n/g, '<br>')
                : optimizeRichTextImages(renderRichText(i.answer)),
            text: toMetaText(i.answer, 1000),
        }))
)

useHead({
    script: [{
        key: `ld-faq-${props.blok._uid}`,
        type: 'application/ld+json',
        innerHTML: () => items.value.length
            ? jsonLd({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: items.value.map(i => ({
                    '@type': 'Question',
                    name: i.question,
                    acceptedAnswer: { '@type': 'Answer', text: i.text },
                })),
            })
            : '',
    }],
})
</script>
