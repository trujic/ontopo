<template>
  <header class="py-4 px-8 md:px-0 max-w-[800px] m-auto">
    <!-- Home Page Header -->
    <div v-if="routeName === 'home'" class="text-center">
      <span class="text-sky-400 hover:cursor-pointer">Ontopo</span>
    </div>

    <!-- Search Page Header -->
    <div v-if="routeName === 'search'" class="flex justify-between">
      <span @click="router.back()" class="hover:cursor-pointer"
        >&#60; Nazad</span
      >
      <span class="font-bold">Rezultati pretrage</span>
      <a href="/" class="text-sky-400 hover:cursor-pointer">Ontopo</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const routeName = computed<string | undefined>(
  () => route.name as string | undefined
);
</script>
