<template>
    <footer class="border-t pt-11 border-t-green-light-ascent">
        <div class="grid md:grid-cols-2 gap-y-8 lg:grid-cols-4 container pb-11">

            <div>
                <img src="/images/logo-ascent.png" class="mb-6 block max-w-28" alt="">
                <ul class="flex gap-4">
                    <li>
                        <NuxtLink :to="'/'">
                            <svg class="scale-50" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.6667 0C12 0 0 11.9733 0 26.7201C0 40.0534 9.76 51.1201 22.5067 53.1201V34.4534H15.7333V26.7201H22.5067V20.8267C22.5067 14.1333 26.48 10.4533 32.5867 10.4533C35.4933 10.4533 38.5333 10.96 38.5333 10.96V17.5467H35.1733C31.8667 17.5467 30.8267 19.6 30.8267 21.7067V26.7201H38.24L37.04 34.4534H30.8267V53.1201C37.1104 52.1275 42.8325 48.9214 46.9597 44.0801C51.0869 39.239 53.3477 33.0817 53.3333 26.7201C53.3333 11.9733 41.3333 0 26.6667 0Z" fill="#27292F"/>
                            </svg>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="'/'">
                            <svg class="scale-50" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 24.3333C3 14.2767 3 9.2484 6.12419 6.12419C9.2484 3 14.2767 3 24.3333 3H29.6667C39.7232 3 44.7517 3 47.8757 6.12419C51 9.2484 51 14.2767 51 24.3333V29.6667C51 39.7232 51 44.7517 47.8757 47.8757C44.7517 51 39.7232 51 29.6667 51H24.3333C14.2767 51 9.2484 51 6.12419 47.8757C3 44.7517 3 39.7232 3 29.6667V24.3333Z" stroke="#27292F" stroke-width="5.33333"/>
                            <path d="M39 19C41.2091 19 43 17.2091 43 15C43 12.7909 41.2091 11 39 11C36.7909 11 35 12.7909 35 15C35 17.2091 36.7909 19 39 19Z" fill="#27292F"/>
                            <path d="M27 35C31.4183 35 35 31.4183 35 27C35 22.5817 31.4183 19 27 19C22.5817 19 19 22.5817 19 27C19 31.4183 22.5817 35 27 35Z" stroke="#27292F" stroke-width="5.33333"/>
                            </svg>
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h4>Ascent Production</h4>
                <p>63000 Clermont-Ferrand</p>

                <a class="text-green-light-ascent" href="tel:0473317444"> 06 44 05 69 92</a>
                <a  class="block text-green-light-ascent" href="mailto:contact@7emesens.fr">ascent.audiovisuel@gmail.com</a>
            </div>

            <div>
                <h4>Navigation</h4>
                <ul>
                    <li>
                        <NuxtLink class="hover:text-green" :to="'/'">Marques</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink class="hover:text-green" :to="'/'">Univers</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink class="hover:text-green" :to="'/'">Réalisations</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink class="hover:text-green" :to="'/'">Contact</NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h4>Liens utiles</h4>
                <a href="" class="button">Nous contacter</a>
            </div>

        </div>

        <div class="border-t border-r-green-light-ascent">
            <ul class="container flex justify-center items-center gap-10">
                <li>
                    <p class="before:hidden">© {{ new Date().getFullYear() }} Ascent Production</p>
                </li>
                <li>
                    <NuxtLink :to="'/politique-de-confidentialite'" >Politique de confidentialité</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="'/mentions-legales'" >Mentions légales</NuxtLink>
                </li>
            </ul>
        </div>
    </footer>

    <button @click="goToTop" ref="scrollButton" class="fixed bg-white right-6 bottom-6 border border-grey-ascent p-4 z-[2]">
        <svg width="16" height="16" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.4086 18.3646C35.4501 17.3232 35.4501 15.635 34.4086 14.5934L21.3627 1.56024C19.2795 -0.5208 15.9041 -0.519973 13.8222 1.56208L0.781117 14.603C-0.260217 15.6446 -0.260217 17.3328 0.781117 18.3744C1.82245 19.4158 3.51098 19.4158 4.55232 18.3744L15.7142 7.21256C16.7555 6.17117 18.4438 6.17117 19.4854 7.21256L30.6374 18.3646C31.6788 19.4062 33.3673 19.4062 34.4086 18.3646Z" fill="#27292F"/>
        </svg>
    </button>

</template>

<script setup>
import { ref, onMounted } from 'vue';


const scrollButton = ref(null);

onMounted(() => {
  document.addEventListener('scroll', handleScroll);
  scrollButton.value.addEventListener('click', goToTop);
});

function handleScroll() {
  if (window.scrollY >= window.innerHeight) {

    scrollButton.value.style.display = 'block';
  } else {
   
    scrollButton.value.style.display = 'none';
  }
}

function goToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}


</script>