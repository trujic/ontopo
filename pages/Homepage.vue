<template>
  <div class="px-8 bg-slate-100">
    <SearchForm />
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from "@/stores/useSearchStore";
import { onMounted } from "vue";

const searchStore = useSearchStore();

onMounted(() => {
  searchStore.posts = [];
  searchStore.totalPosts = 0;
});
</script>
