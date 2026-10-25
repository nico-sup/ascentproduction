<template>
    <dialog ref="dialog" class="booking-dialog" aria-labelledby="booking-title" @close="onClose" @click="onBackdrop">
        <div class="booking-bar">
            <button type="button" class="booking-close" aria-label="Fermer" @click="close">
                <svg width="20" height="20" viewBox="-0.5 0 25 25" fill="none" aria-hidden="true">
                    <path d="M3 21.32L21 3.32001M3 3.32001L21 21.32" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </button>
        </div>
        <div class="booking-inner">

            <template v-if="status !== 'sent'">
                <p class="text-sm uppercase tracking-wide m-0 opacity-70">Réserver cette offre</p>
                <h2 id="booking-title" tabindex="-1" class="text-2xl font-bold mt-1 mb-1">{{ pack?.name }}</h2>
                <p class="text-green-light-ascent font-bold mt-0 mb-6">{{ priceLabel }}</p>

                <form class="booking-form" novalidate @submit.prevent="submit">
                    <div class="formInput">
                        <label for="bk-lastname">Nom *</label>
                        <input id="bk-lastname" v-model.trim="form.lastName" type="text" autocomplete="family-name" required maxlength="100">
                        <div class="error" aria-live="polite">{{ errors.lastName }}</div>
                    </div>
                    <div class="formInput">
                        <label for="bk-firstname">Prénom *</label>
                        <input id="bk-firstname" v-model.trim="form.firstName" type="text" autocomplete="given-name" required maxlength="100">
                        <div class="error" aria-live="polite">{{ errors.firstName }}</div>
                    </div>
                    <div class="formInput">
                        <label for="bk-email">Adresse mail *</label>
                        <input id="bk-email" v-model.trim="form.email" type="email" inputmode="email" autocomplete="email" required maxlength="200">
                        <div class="error" aria-live="polite">{{ errors.email }}</div>
                    </div>
                    <div class="formInput">
                        <label for="bk-phone">Téléphone</label>
                        <input id="bk-phone" :value="form.phone" type="tel" inputmode="numeric" autocomplete="tel"
                            placeholder="06 00 00 00 00" maxlength="14" @input="formatPhone">
                    </div>
                    <div class="formInput md:col-span-2">
                        <label for="bk-date">Date souhaitée</label>
                        <input id="bk-date" v-model="form.date" type="date" :min="today">
                    </div>
                    <div class="formInput md:col-span-2">
                        <label for="bk-message">Votre projet *</label>
                        <textarea id="bk-message" v-model.trim="form.message" required maxlength="5000"
                            placeholder="Lieu, nombre de vidéos, contexte…"></textarea>
                        <div class="error" aria-live="polite">{{ errors.message }}</div>
                    </div>

                    <!-- Piège anti-robots -->
                    <div class="hp-field" aria-hidden="true">
                        <label for="bk-website">Ne pas remplir</label>
                        <input id="bk-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex items-start gap-3">
                            <input id="bk-rgpd" v-model="form.rgpd" type="checkbox" class="mt-1.5" required>
                            <label for="bk-rgpd" class="text-sm">
                                J'accepte qu'Ascent Production utilise ces informations pour répondre à ma demande.
                            </label>
                        </div>
                        <div class="error !static mt-1" aria-live="polite">{{ errors.rgpd }}</div>
                    </div>

                    <div class="booking-submit md:col-span-2">
                        <button type="submit" class="button w-full justify-center" :disabled="status === 'sending'">
                            {{ status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande de réservation' }}
                        </button>
                        <p v-if="status === 'error'" class="mt-3 font-bold text-red-600" role="alert">
                            L'envoi a échoué. Réessayez ou écrivez à {{ site.email }}.
                        </p>
                    </div>
                </form>
            </template>

            <div v-else class="py-8 text-center" role="status">
                <h2 id="booking-title" class="text-2xl font-bold">Demande envoyée, merci !</h2>
                <p>Votre demande pour le pack <strong>{{ pack?.name }}</strong> a bien été transmise.
                    Je reviens vers vous rapidement pour confirmer la date et le devis.</p>
                <button type="button" class="button mt-4" @click="close">Fermer</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

const site = useAppConfig().site
const nuxtApp = useNuxtApp()
const dialog = ref(null)
const pack = ref(null)
const status = ref('idle')
const today = new Date().toISOString().slice(0, 10)

const blank = () => ({ lastName: '', firstName: '', email: '', phone: '', date: '', message: '', rgpd: false, website: '' })
const form = reactive(blank())
const errors = reactive({ lastName: '', firstName: '', email: '', message: '', rgpd: '' })

const priceLabel = computed(() => {
    const p = pack.value
    if (!p) return ''
    return [p.price_prefix, p.price, p.price_suffix].filter(Boolean).join(' ')
})

function open(p) {
    pack.value = p
    status.value = 'idle'
    Object.assign(form, blank())
    Object.keys(errors).forEach(k => (errors[k] = ''))
    dialog.value?.showModal()
    // Page derrière bloquée pendant que la fenêtre est ouverte
    nuxtApp.$lenis?.stop()
    document.documentElement.classList.add('has-dialog')
    if (dialog.value) dialog.value.scrollTop = 0
    // Sur mobile, on n'ouvre pas le clavier d'office : il masquerait la fenêtre
    const touch = window.matchMedia('(hover: none)').matches
    nextTick(() => (touch ? dialog.value?.querySelector('#booking-title') : document.getElementById('bk-lastname'))?.focus({ preventScroll: true }))
}

function close() {
    dialog.value?.close()
}

function onClose() {
    nuxtApp.$lenis?.start()
    document.documentElement.classList.remove('has-dialog')
}

// Clic sur le fond sombre = fermeture
function onBackdrop(e) {
    if (e.target === dialog.value) close()
}

function formatPhone(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    form.phone = digits.replace(/(\d{2})(?=\d)/g, '$1 ')
    e.target.value = form.phone
}

function validate() {
    errors.lastName = form.lastName ? '' : "Merci d'indiquer votre nom"
    errors.firstName = form.firstName ? '' : "Merci d'indiquer votre prénom"
    errors.email = EMAIL_RE.test(form.email) ? '' : 'Adresse mail non valide'
    errors.message = form.message.length >= 10 ? '' : 'Décrivez votre projet en quelques mots'
    errors.rgpd = form.rgpd ? '' : "Merci d'accepter le traitement de vos données"
    const first = Object.keys(errors).find(k => errors[k])
    if (first) {
        const ids = { lastName: 'bk-lastname', firstName: 'bk-firstname', email: 'bk-email', message: 'bk-message', rgpd: 'bk-rgpd' }
        document.getElementById(ids[first])?.focus()
        return false
    }
    return true
}

function formatDate(iso) {
    if (!iso) return 'non précisée'
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
}

async function submit() {
    if (status.value === 'sending') return
    if (form.website) { status.value = 'sent'; return }
    if (!validate()) return
    status.value = 'sending'
    try {
        await sendEmail({
            object: `Réservation – Pack ${pack.value.name} (${priceLabel.value})`,
            email_id: form.email,
            from_name: form.lastName,
            from_firstName: form.firstName,
            from_telephone: form.phone,
            message: [
                `Offre demandée : Pack ${pack.value.name}`,
                `Prix affiché : ${priceLabel.value}`,
                `Date souhaitée : ${formatDate(form.date)}`,
                '',
                form.message,
            ].join('\n'),
            rgpd: form.rgpd,
        })
        status.value = 'sent'
    } catch (e) {
        console.error(e)
        status.value = 'error'
    }
}

defineExpose({ open })
</script>
