<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const active = ref(0);

function isPrimaryPage() {
  return route.fullPath === "/home" || route.fullPath === "/user";
}

router.beforeEach((to) => {
  if (to.fullPath.startsWith("/home")) {
    active.value = 0;
  } else {
    active.value = 1;
  }
});

onMounted(() => {
  if (route.fullPath.startsWith("/home")) {
    active.value = 0;
  } else {
    active.value = 1;
  }
});
</script>

<template>
  <div class="home">
    <router-view></router-view>

    <van-tabbar v-if="isPrimaryPage()" v-model="active">
      <van-tabbar-item icon="home-o" to="/home">主页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">用户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped lang="scss">
.home {
  .add-options {
    position: relative;
    top: -3vw;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12vw;
    height: 12vw;
    border: 1px solid rgb(221, 221, 221);
    border-radius: 50%;
    background: #fff;
  }
}
</style>
