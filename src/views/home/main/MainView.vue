<script setup lang="ts">
import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import { getRoutesByJurisdiction } from "@/utils/getRoutesByJurisdiction";

const routes = getRoutesByJurisdiction();
</script>

<template>
  <div class="main">
    <main-wrapper title="首页">
      <van-grid>
        <van-grid-item
          v-for="route of routes"
          :key="route.path"
          :icon="route.icon"
          :text="route.text"
          :to="route.path"
        />
      </van-grid>
    </main-wrapper>
  </div>
</template>

<style scoped></style>
