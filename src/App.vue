<script setup>
  import Navbar from "./components/Navbar.vue"
</script>

<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
