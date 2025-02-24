<template>
  <div :class="['navigation grid z-10 w-full top-0', isProjectPage || isHomePage ? 'fixed w-full' : 'fixed']">
    <nav class="flex justify-between items-center container py-5 z-[1]">
      <div class="logo" data-aos="fade-right">
        <NuxtLink :to="'/'">
          <img src="/images/logo.png" class="z-[1] h-14">
        </NuxtLink>
      </div>

      <div>
        <button @click="toggleHeaderActive" data-aos="fade-left">
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" stroke-width="1" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div :class="{ 'header-active': isActive }" class="level_0 flex flex-col p-5 z-10">

          <button @click="toggleHeaderActive" class="self-start flex justify-end self-end col-start-8">
            <svg width="30px" height="30px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <ul class="flex gap-10 flex-col justify-center items-center text-black col-span-8 flex-1">
            <li  @click="toggleHeaderActive" >
              <NuxtLink :to="'/'">Accueil</NuxtLink>
            </li>
            <li  @click="toggleHeaderActive" >
              <NuxtLink :to="'/projects'">Nos réalisations</NuxtLink>
            </li>
            <li  @click="toggleHeaderActive" >
              <NuxtLink :to="'/projects'">Nos expertises</NuxtLink>
            </li>
            <li  @click="toggleHeaderActive" >
              <NuxtLink :to="'/contact'">Contact</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const isActive = ref(false);
const route = useRoute();

// Vérifie si la route actuelle est la page d'accueil
const isHomePage = computed(() => route.path === '/');

// Vérifie si la route appartient à "projects/" mais pas à "/projects" seul
const isProjectPage = computed(() => route.path.startsWith('/projects/') && route.path !== '/projects');

function toggleHeaderActive() {
  isActive.value = !isActive.value;
}
</script>

