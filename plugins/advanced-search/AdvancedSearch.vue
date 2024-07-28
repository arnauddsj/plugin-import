<template>
  <div class="advanced-search">
    <h2>Advanced Search Plugin</h2>
    <button @click="performSearch">Perform Advanced Search</button>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result">{{ result }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AdvancedSearch",
  setup() {
    const results = ref<string[]>([]);

    const performSearch = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/advanced-search");
        const data = await response.json();
        results.value = data.results;
      } catch (error) {
        console.error("Error performing advanced search:", error);
      }
    };

    return {
      results,
      performSearch,
    };
  },
});
</script>
