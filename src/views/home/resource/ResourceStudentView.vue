<script setup lang="ts">
import { storeToRefs } from "pinia";

import useResourceStore from "@/stores/resource";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";
import stroage from "@/utils/stroage";

const resourceStore = useResourceStore();

const user = stroage.get("user");
const { resourceList } = storeToRefs(resourceStore);

resourceStore.fetchResourceListAction(user.class_id);
</script>

<template>
  <div class="resource-info">
    <main-wrapper title="资源管理" :is-left-arrow="true">
      <div :style="{ display: 'flex', height: '100%' }">
        <div style="width: 100%">
          <transition-group name="card">
            <card-item
              v-for="item of resourceList"
              :key="item.id"
              :item="item"
              label="资源名称"
            ></card-item>
          </transition-group>
        </div>
      </div>
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.resource-info {
  position: relative;
  height: 100vh;
  .selection {
    overflow: hidden;
    transition: all 0.5s ease;
  }
}

.card-leave-from,
.card-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.card-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.card-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.card-move,
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease-in;
}
.card-leave-active {
  width: 96vw;
  position: absolute;
}
</style>
