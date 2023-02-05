<script setup lang="ts">
import useLoginStore from "./stores/login";

const loginStore = useLoginStore();
loginStore.initializationAction();
</script>

<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100%;
}
</style>
