<template>

    <div class="container form mb-24">
        <div class="page-hero-head px-0">
            <h1 v-reveal class="page-hero-title">Nous contacter</h1>
            <p class="page-hero-aside lede m-0">Ascent Production, production audiovisuelle et drone à Clermont-Ferrand.</p>
        </div>
        <p class="max-w-3xl mb-14 split-body">
            Un projet de film d'entreprise, de vidéo publicitaire, de captation d'événement
            ou de prise de vue par drone ? Décrivez-le nous : nous vous répondons rapidement. Basés à Clermont-Ferrand (Puy-de-Dôme),
            nous intervenons en Auvergne et partout en France.
        </p>

        <div class="grid md:grid-cols-2 gap-20">
            <form id="myForm" novalidate @submit.prevent="submitForm">

                    <div class="required formInput">
                        <label for="fullName">Nom *</label>
                        <input v-model.trim="form.lastName" type="text" id="fullName" name="lastName" placeholder="Nom"
                            autocomplete="family-name" required maxlength="100">
                        <div class="error" aria-live="polite">{{ errors.lastName }}</div>
                    </div>

                    <div class="required formInput">
                        <label for="firstName">Prénom *</label>
                        <input v-model.trim="form.firstName" type="text" id="firstName" name="firstName" placeholder="Prénom"
                            autocomplete="given-name" required maxlength="100">
                        <div class="error" aria-live="polite">{{ errors.firstName }}</div>
                    </div>

                    <div class="required formInput">
                        <label for="email_id">Adresse mail *</label>
                        <input v-model.trim="form.email" type="email" id="email_id" name="email" placeholder="Email"
                            autocomplete="email" inputmode="email" required maxlength="200">
                        <div class="error" aria-live="polite">{{ errors.email }}</div>
                    </div>

                    <div class="formInput">
                        <label for="telephone">Téléphone</label>
                        <input :value="form.phone" @input="formatPhoneNumber" type="tel" name="telephone" inputmode="numeric"
                            id="telephone" autocomplete="tel" placeholder="06 00 00 00 00" maxlength="14" />
                    </div>

                    <!-- Piège anti-robots : invisible pour les humains -->
                    <div class="hp-field" aria-hidden="true">
                        <label for="website">Ne pas remplir</label>
                        <input v-model="form.website" type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="messageWrapper col-span-2">

                        <div class="formInput mb-5">
                            <label for="object">Objet du message</label>
                            <input v-model.trim="form.object" type="text" placeholder="Objet" id="object" name="object" maxlength="200">
                        </div>

                        <div class="formInput mt-5">
                            <label for="message">Message *</label>
                            <textarea v-model.trim="form.message" name="message" id="message" required maxlength="5000"></textarea>
                            <div class="error" aria-live="polite">{{ errors.message }}</div>
                        </div>

                        <div class="checkRgpd flex items-start gap-4 mt-6 relative">
                            <input v-model="form.rgpd" type="checkbox" class="mt-1.5" id="rgpd" required>
                            <label for="rgpd" class="rgpd font-normal">
                                En remplissant ce formulaire et en le validant, vous consentez à ce que Ascent Production, en sa qualité de responsable de traitement, collecte vos données afin de pouvoir répondre à votre message.
                            </label>
                        </div>
                        <div class="error !static mt-2" aria-live="polite">{{ errors.rgpd }}</div>

                        <button class="sendButton button mt-5" type="submit" :disabled="status === 'sending' || status === 'sent'">
                            {{ buttonLabel }}
                        </button>

                        <p v-if="status === 'sent'" class="mt-4 font-bold text-green-ascent" role="status">
                            Merci ! Votre message a bien été envoyé, nous vous répondons rapidement.
                        </p>
                        <p v-if="status === 'error'" class="mt-4 font-bold text-red-600" role="alert">
                            Oups… l'envoi a échoué. Réessayez ou écrivez-nous directement à {{ site.email }}.
                        </p>
                    </div>
                </form>
            <iframe class="w-full" title="Carte : Ascent Production à Clermont-Ferrand"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44515.29525332366!2d3.0715080005685262!3d45.787101499681185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f71bdd7f2e8507%3A0x3994306038a06f22!2sClermont-Ferrand!5e0!3m2!1sfr!2sfr!4v1740038807423!5m2!1sfr!2sfr"
                width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div class="grid md:grid-cols-3 gap-4 mt-10">
            <div>
                <p class="text-xl">Téléphone :</p>
                <a :href="`tel:${site.phoneIntl}`" class="before:hidden hover:text-green-light-ascent flex text-xl items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M4.8621 0.85459C4.8621 0.85459 4.57489 0.230225 4.13624 0.230225C3.70456 0.230225 3.48001 0.415192 3.33031 0.542811C3.18062 0.67043 0.675805 2.58068 0.675805 2.58068C0.675805 2.58068 -0.0526622 3.17112 0.00303894 4.28173C0.0500368 5.39234 0.284156 6.97305 1.49914 9.17488C2.70542 11.3719 5.72459 14.7287 7.63236 15.9088C7.63236 15.9088 9.4 17.1672 11.0449 17.6785C11.5227 17.8183 12.4784 18 12.7012 18C12.9275 18 13.3269 18 13.7856 17.689C14.2521 17.3748 16.8692 15.4218 16.8692 15.4218C16.8692 15.4218 17.5097 14.8846 16.7656 14.2603C16.018 13.6359 13.7482 12.2474 13.2625 11.8824C12.776 11.5116 12.0832 11.6748 11.7838 11.926C11.4853 12.1788 10.9518 12.5948 10.8865 12.6473C10.789 12.7167 10.5219 12.9421 10.2225 12.8298C9.84126 12.6901 8.27814 11.9025 6.82904 10.0626C5.38865 8.2242 5.23025 7.62326 5.01527 6.97385C4.97881 6.87785 4.97831 6.77325 5.01385 6.67695C5.04938 6.58065 5.11888 6.49829 5.2111 6.44318C5.42694 6.30426 6.22155 5.68958 6.22155 5.68958C6.22155 5.68958 6.73592 5.21869 6.52095 4.66378C6.30597 4.10888 4.8621 0.85459 4.8621 0.85459Z" fill="#27292F"/>
                    </svg>
                    {{ site.phone }}
                </a>
            </div>

            <div>
                <p class="text-xl">Adresse mail :</p>
                <a :href="`mailto:${site.email}`" class="before:hidden flex  items-center gap-2 hover:text-green-light-ascent">
                    <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M21.967 4.42857C21.967 4.42857 17.2756 10.1429 11.5006 10.1429C5.72559 10.1429 1.03418 4.42857 1.03418 4.42857M4.73333 17H18.2667C19.5734 17 20.2269 17 20.726 16.7509C21.165 16.5318 21.522 16.1821 21.7457 15.752C22 15.2631 22 14.623 22 13.3429V4.65714C22 3.37703 22 2.73696 21.7457 2.24802C21.522 1.81793 21.165 1.46826 20.726 1.24913C20.2269 1 19.5734 1 18.2667 1H4.73333C3.42655 1 2.77315 1 2.27402 1.24913C1.83497 1.46826 1.47802 1.81793 1.25432 2.24802C1 2.73696 1 3.37702 1 4.65714V13.3429C1 14.623 1 15.2631 1.25432 15.752C1.47802 16.1821 1.83497 16.5318 2.27402 16.7509C2.77315 17 3.42654 17 4.73333 17Z" stroke="#27292F" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ site.email }}
                </a>
            </div>

            <div>
                <p class="text-xl">Déplacement</p>
                <p class="text-xl">Clermont-Ferrand, Auvergne et toute la France</p>
            </div>

        </div>

    </div>

</template>

<script setup>
import { reactive, ref, computed } from 'vue';

// URL en minuscules (le fichier s'appelle Contact.vue, ce qui créait aussi /Contact en double)
definePageMeta({ path: '/contact' });

const site = useAppConfig().site;

// Identifiants EmailJS (clé publique : elle est faite pour être visible côté navigateur).
// Pense à restreindre les domaines autorisés dans le tableau de bord EmailJS.
const EMAILJS = {
    publicKey: 'zuE8HajcfqCIStJEm',
    serviceId: 'service_b1ofmh9',
    templateId: 'template_rfpd68p',
};

const form = reactive({
    lastName: '', firstName: '', email: '', phone: '', object: '', message: '', rgpd: false, website: '',
});
const errors = reactive({ lastName: '', firstName: '', email: '', message: '', rgpd: '' });
const status = ref('idle'); // idle | sending | sent | error

const buttonLabel = computed(() => ({
    sending: 'Envoi en cours…',
    sent: 'Message envoyé',
}[status.value] || 'Envoyer'));

function formatPhoneNumber(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ');
    form.phone = formatted;
    event.target.value = formatted;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate() {
    errors.lastName = form.lastName ? '' : 'Merci d\'indiquer votre nom';
    errors.firstName = form.firstName ? '' : 'Merci d\'indiquer votre prénom';
    errors.email = EMAIL_RE.test(form.email) ? '' : 'Adresse mail non valide';
    errors.message = form.message.length >= 10 ? '' : 'Votre message est trop court';
    errors.rgpd = form.rgpd ? '' : 'Merci d\'accepter le traitement de vos données';
    const firstError = Object.keys(errors).find(k => errors[k]);
    if (firstError) {
        const ids = { lastName: 'fullName', firstName: 'firstName', email: 'email_id', message: 'message', rgpd: 'rgpd' };
        document.getElementById(ids[firstError])?.focus();
        return false;
    }
    return true;
}

async function submitForm() {
    if (status.value === 'sending' || status.value === 'sent') return;
    // Robot détecté : on fait semblant que tout s'est bien passé
    if (form.website) { status.value = 'sent'; return; }
    if (!validate()) return;

    status.value = 'sending';
    try {
        const { default: emailjs } = await import('@emailjs/browser');
        await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
            object: form.object,
            email_id: form.email,
            from_name: form.lastName,
            from_firstName: form.firstName,
            from_telephone: form.phone,
            message: form.message,
            rgpd: form.rgpd,
        }, { publicKey: EMAILJS.publicKey });
        status.value = 'sent';
    } catch (e) {
        console.error(e);
        status.value = 'error';
    }
}

useSeoMeta({
    title: 'Contact & devis – Production vidéo à Clermont-Ferrand',
    description: `Contactez Ascent Production pour votre projet vidéo, drone ou photo à Clermont-Ferrand et en Auvergne. Téléphone : ${site.phone}.`,
    ogTitle: 'Contact – Ascent Production, production audiovisuelle à Clermont-Ferrand',
    ogDescription: 'Un projet vidéo, drone ou photo ? Parlons-en.',
    ogImage: `${site.url}${site.ogImage}`,
    ogUrl: `${site.url}/contact`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
});

useHead({
    link: [{ rel: 'canonical', href: `${site.url}/contact` }],
    script: [{
        key: 'ld-page',
        type: 'application/ld+json',
        innerHTML: jsonLd({
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'ContactPage',
                    '@id': `${site.url}/contact#webpage`,
                    url: `${site.url}/contact`,
                    name: 'Contacter Ascent Production',
                    inLanguage: 'fr-FR',
                    isPartOf: { '@id': `${site.url}/#website` },
                    about: { '@id': `${site.url}/#organization` },
                    breadcrumb: { '@id': `${site.url}/contact#breadcrumb` },
                },
                {
                    '@type': 'BreadcrumbList',
                    '@id': `${site.url}/contact#breadcrumb`,
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
                        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${site.url}/contact` },
                    ],
                },
            ],
        }),
    }],
});
</script>
