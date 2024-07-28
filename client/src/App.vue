<script setup lang="ts">
// No setup logic needed for now
</script>

<template>
  <div id="app">
    <nav>
      <!-- Add navigation links here if needed -->
      <router-link to="/">Home</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>
