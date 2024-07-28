<script setup lang="ts">
import { ref, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  isLoading.value = false;
});
</script>

<template>
  <div id="app">
    <div v-if="isLoading" class="loading">Loading...</div>
    <template v-else>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
      </nav>

      <router-view></router-view>
    </template>
  </div>
</template>

<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 24px;
}
</style>
