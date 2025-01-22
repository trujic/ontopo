<template>
  <div class="px-8 bg-slate-100">
    <div class="p-6 bg-white max-w-[900px] m-auto">
      <SearchForm />
      <div
        v-if="searchStore.isLoading"
        class="flex justify-center items-center mt-8"
      >
        <div class="loader justify-center"></div>
      </div>

      <!-- Show Posts -->
      <div v-else-if="searchStore.posts.length > 0" class="mt-8">
        <ul class="space-y-4">
          <li v-for="post in searchStore.posts" :key="post.slug" class="py-2">
            <div
              class="flex flex-col md:flex-row gap-4 justify-between border-2 p-4"
            >
              <h4 class="font-bold text-xl">{{ post.post.venue_name }}</h4>
              <div class="flex flex-col">
                <div
                  class="flex gap-0 md:gap-4 justify-between md:justify-none"
                >
                  <!-- Loop through recommended availability -->
                  <div
                    v-for="item in post.availability.recommended"
                    :key="item.id"
                    class="w-full md:w-[150px] justify-center p-4 border-2 h-fit"
                  >
                    <div>{{ formatTime(item.time) }}</div>
                    <h3 class="truncate">
                      {{ item.text }}
                    </h3>
                  </div>
                </div>
                <button
                  v-if="post.availability.areas"
                  @click="toggleAreas(post.post.slug)"
                  class="mt-4"
                >
                  {{
                    expandedPostId === post.post.slug
                      ? "Prikazi Manje"
                      : "Prikazi Jos"
                  }}
                </button>

                <!-- List availability.areas -->
                <div
                  v-if="expandedPostId === post.post.slug"
                  class="mt-4 flex-col"
                >
                  <div
                    v-for="area in post.availability.areas"
                    :key="area.id"
                    class="p-4 border rounded mb-2"
                  >
                    <h4 class="font-bold text-lg">{{ area.id }}</h4>
                    <div class="ml-4 flex">
                      <!-- Loop through options -->
                      <div
                        v-for="option in area.options"
                        :key="option.time"
                        class="p-2 border-2 flex-col items-center"
                      >
                        <div>{{ formatTime(option.time) }}</div>
                        <div>{{ option.text }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mt-8 text-center">
        No restaurants found. Please try another search.
      </div>
      <button
        :disabled="
          searchStore.isLoading ||
          searchStore.totalPosts <= searchStore.posts.length
        "
        @click="loadMorePosts"
        class="mt-4 p-4 bg-black text-white flex items-center justify-center w-[200px]"
      >
        <span v-if="isButtonLoading" class="loader w-6 h-6"></span>
        <span v-else>Prikazi jos rezultata</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from "@/stores/useSearchStore";
import { ref } from "vue";

const searchStore = useSearchStore();

const expandedPostId = ref<string | null>(null);

// Toggle visibility of post details
const toggleAreas = (id: string): void => {
  expandedPostId.value = expandedPostId.value === id ? null : id;
};

// Format time helper function
const formatTime = (time: string): string => {
  const hours = time.slice(0, 2); // First two characters (hours)
  const minutes = time.slice(2); // Last two characters (minutes)
  return `${hours}:${minutes}`;
};

const isButtonLoading = ref<boolean>(false);

// Load more posts with loading indicator
const loadMorePosts = async (): Promise<void> => {
  isButtonLoading.value = true;
  try {
    await searchStore.fetchAvailableRestaurants();
  } finally {
    isButtonLoading.value = false;
  }
};
</script>

<style>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
