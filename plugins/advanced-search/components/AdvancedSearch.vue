<template>
  <div class="advanced-search">
    <h2>Advanced Search Plugin</h2>
    <button @click="performSearch" :disabled="isLoading">
      {{ isLoading ? "Searching..." : "Perform Advanced Search" }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result">{{ result }}</li>
    </ul>
    <p v-else-if="!isLoading && !error">No results found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AdvancedSearch",
  setup() {
    const results = ref<string[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const performSearch = async () => {
      isLoading.value = true;
      error.value = null;
      results.value = [];

      try {
        const response = await fetch("http://localhost:3000/api/advanced-search");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        results.value = data.results || [];
      } catch (e) {
        console.error("Error performing advanced search:", e);
        error.value = "An error occurred while searching. Please try again.";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      results,
      performSearch,
      isLoading,
      error,
    };
  },
});
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
