<template>

    <div class="container form mb-24">
        <h2 class="my-10 font-bold">Nous contacter</h2>

        <div class="grid md:grid-cols-2 gap-20">
            <form action="" id="myForm" method="POST" @submit.prevent="submitForm">
                
                    <div class="required formInput">
                        <label for="fullname">Nom *</label>
                        <input type="text" class="inputRequired" id="fullName" placeholder="Nom" required>
                        <div class="error"></div>
                    </div>
        
                    <div class="required formInput">
                        <label for="firstname">Prénom *</label>
                        <input type="text" class="inputRequired" id="firstName" placeholder="Prénom" required>
                        <div class="error"></div>
                    </div>
        
                    <div class="required formInput">
                        <label for="email_id">Adresse mail *</label>
                        <input type="text" class="inputRequired" id="email_id" placeholder="Email" required>
                        <div class="error"></div>
                    </div>

                    <div class="required formInput">
                        <label for="telephone">Téléphone</label>
                        <input type="tel" name="telephone" inputmode="numeric" id="telephone" pattern="[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}" placeholder="06 00 00 00 00" />
                    </div>
                    
        
                    <div class="messageWrapper col-span-2">
        
                        <div class="formInput mb-5">
                            <label for="object">Objet du message</label>
                            <input type="text" placeholder="objet" id="object" name="object">
                        </div>
        
                        <div class="formInput mt-5">
                            <label for="message">Message</label>
                            <textarea name="" id="message" class="inputRequired" placeholder="" required ></textarea>
                            <div class="error"></div>
                        </div>
                        
                        <div class="checkRgpd flex items-start gap-4 mt-6">
                            <input type="checkbox" class="mt-1.5" id="rgpd" required>
                            <div class="rgpd">
                                En remplissant ce formulaire et en le validant, vous consentez à ce que Ascent Production, en sa qualité de responsable de traitement, collecte vos données afin de pouvoir répondre à votre message.
                            </div>
                            <div class="error"></div>
                        </div>
        
                        <button class="sendButton button mt-5" type="submit" :disabled="formSubmitted">
                            {{ formSubmitted ? 'Formulaire soumis' : 'Envoyer' }}
                        </button>
        
                    </div>
                </form>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44515.29525332366!2d3.0715080005685262!3d45.787101499681185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f71bdd7f2e8507%3A0x3994306038a06f22!2sClermont-Ferrand!5e0!3m2!1sfr!2sfr!4v1740038807423!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div class="grid md:grid-cols-3 gap-4 mt-10">
            <div>
                <p class="text-xl">Téléphone :</p>
                <a href="tel:0473317444" class="before:hidden hover:text-blue-ascent flex text-xl items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.8621 0.85459C4.8621 0.85459 4.57489 0.230225 4.13624 0.230225C3.70456 0.230225 3.48001 0.415192 3.33031 0.542811C3.18062 0.67043 0.675805 2.58068 0.675805 2.58068C0.675805 2.58068 -0.0526622 3.17112 0.00303894 4.28173C0.0500368 5.39234 0.284156 6.97305 1.49914 9.17488C2.70542 11.3719 5.72459 14.7287 7.63236 15.9088C7.63236 15.9088 9.4 17.1672 11.0449 17.6785C11.5227 17.8183 12.4784 18 12.7012 18C12.9275 18 13.3269 18 13.7856 17.689C14.2521 17.3748 16.8692 15.4218 16.8692 15.4218C16.8692 15.4218 17.5097 14.8846 16.7656 14.2603C16.018 13.6359 13.7482 12.2474 13.2625 11.8824C12.776 11.5116 12.0832 11.6748 11.7838 11.926C11.4853 12.1788 10.9518 12.5948 10.8865 12.6473C10.789 12.7167 10.5219 12.9421 10.2225 12.8298C9.84126 12.6901 8.27814 11.9025 6.82904 10.0626C5.38865 8.2242 5.23025 7.62326 5.01527 6.97385C4.97881 6.87785 4.97831 6.77325 5.01385 6.67695C5.04938 6.58065 5.11888 6.49829 5.2111 6.44318C5.42694 6.30426 6.22155 5.68958 6.22155 5.68958C6.22155 5.68958 6.73592 5.21869 6.52095 4.66378C6.30597 4.10888 4.8621 0.85459 4.8621 0.85459Z" fill="#27292F"/>
                    </svg>
                    06 44 05 69 92
                </a>
            </div>

            <div>
                <p class="text-xl">Adresse mail :</p>
                <a href="mailto:contact@7emesens.fr" class="before:hidden flex  items-center gap-2 hover:text-blue-ascent">
                    <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.967 4.42857C21.967 4.42857 17.2756 10.1429 11.5006 10.1429C5.72559 10.1429 1.03418 4.42857 1.03418 4.42857M4.73333 17H18.2667C19.5734 17 20.2269 17 20.726 16.7509C21.165 16.5318 21.522 16.1821 21.7457 15.752C22 15.2631 22 14.623 22 13.3429V4.65714C22 3.37703 22 2.73696 21.7457 2.24802C21.522 1.81793 21.165 1.46826 20.726 1.24913C20.2269 1 19.5734 1 18.2667 1H4.73333C3.42655 1 2.77315 1 2.27402 1.24913C1.83497 1.46826 1.47802 1.81793 1.25432 2.24802C1 2.73696 1 3.37702 1 4.65714V13.3429C1 14.623 1 15.2631 1.25432 15.752C1.47802 16.1821 1.83497 16.5318 2.27402 16.7509C2.77315 17 3.42654 17 4.73333 17Z" stroke="#27292F" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ascent.audiovisuel@gmail.com
                </a>
            </div>

            <div>
                <p class="text-xl">Déplacement</p>
                <p class="text-xl" >Toute la France</p>
            </div>

        </div>

    </div>
    
</template>

<script>
import emailjs from '@emailjs/browser';
export default {
    data() {
        return {
            formSubmitted: false
        };
    },

    mounted() {
        const telephoneInput = document.getElementById('telephone');
        telephoneInput.addEventListener('input', this.formatPhoneNumber);
        telephoneInput.addEventListener('keydown', this.limitPhoneNumberLength);
    },

    methods: {

        formatPhoneNumber(event) {
            let input = event.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non numériques
            input = input.replace(/(\d{2})(?=\d)/g, '$1 '); // Ajouter un espace tous les deux caractères
            event.target.value = input;
        },

        // Méthode pour limiter la longueur du numéro de téléphone au nombre de caractères du placeholder
        limitPhoneNumberLength(event) {
            const maxLength = event.target.placeholder.replace(/\D/g, '').length; // Récupérer le nombre de caractères du placeholder
            if (event.target.value.replace(/\D/g, '').length >= maxLength && event.key !== 'Backspace') {
                event.preventDefault();
            }
        },

        // Méthode pour vérifier si l'adresse e-mail est valide
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // Méthode pour soumettre le formulaire
        submitForm() {
            (function () {emailjs.init("zuE8HajcfqCIStJEm");})();
            if (!this.formSubmitted) {
                const params = {
                    object : document.getElementById('object').value.trim(),
                    email_id : document.getElementById('email_id').value.trim(),
                    from_name : document.getElementById('fullName').value.trim(),
                    from_firstName : document.getElementById('firstName').value.trim(),
                    from_telephone : document.getElementById('telephone').value.trim(),
                    message : document.getElementById('message').value.trim(),
                    rgpd: document.getElementById('rgpd').checked,
                };

                // Vérification de la validité de l'adresse e-mail
                if (!this.isValidEmail(params.email_id)) {
                    document.getElementById('email_id').parentNode.querySelector('.error').textContent = 'adresse mail non valide' 
                    window.scrollTo({ top: document.getElementById('email_id'), behavior: 'smooth' });
                    return;
                }

                // Envoi du formulaire par e-mail
                emailjs.send("service_b1ofmh9", "template_rfpd68p", params)
                    .then((response) => {
                        alert("Votre message a bien été envoyé");
                        this.formSubmitted = true; // Désactiver le bouton d'envoi après soumission
                    })
                    .catch((error) => {
                        alert("Oups... quelque chose s'est mal passé.", error);
                    });
            }
        },

    }
}

</script>