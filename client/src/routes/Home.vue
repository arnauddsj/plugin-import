<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from "vue";

interface Asset {
  id: number;
  name: string;
  type: string;
}

const assets = ref<Asset[]>([]);
const newAsset = ref({ name: "", type: "" });

// Dynamically import the AdvancedSearch component
const AdvancedSearch = defineAsyncComponent(
  () => import("@plugins/advanced-search/AdvancedSearch.vue")
);

onMounted(async () => {
  const response = await fetch("http://localhost:3000");
  const data = await response.json();
  assets.value = data.assets;
});

const addAsset = async () => {
  const response = await fetch("http://localhost:3000/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAsset.value),
  });
  const asset = await response.json();
  assets.value.push(asset);
  newAsset.value = { name: "", type: "" };
};
</script>

<template>
  <div>
    <h1>Damvia Asset Manager</h1>

    <h2>Assets</h2>
    <ul>
      <li v-for="asset in assets" :key="asset.id">{{ asset.name }} ({{ asset.type }})</li>
    </ul>

    <h2>Add New Asset</h2>
    <form @submit.prevent="addAsset">
      <input v-model="newAsset.name" placeholder="Asset Name" required />
      <input v-model="newAsset.type" placeholder="Asset Type" required />
      <button type="submit">Add Asset</button>
    </form>

    <AdvancedSearch />
  </div>
</template>
