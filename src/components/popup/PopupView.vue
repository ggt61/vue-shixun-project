<script setup lang="ts">
import { defineEmits } from "vue";

interface IProps {
  show: boolean;
}

withDefaults(defineProps<IProps>(), {
  show: false,
});

const emits = defineEmits(["update:show"]);

function onAfterEnter() {
  emits("update:show", false);
}
</script>

<template>
  <div class="popup">
    <Transition name="popup" type="animation" @after-enter="onAfterEnter">
      <template v-if="show">
        <div
          :style="{
            position: 'absolute',
            top: '30vh',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
          }"
        >
          <slot></slot>
        </div>
      </template>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
.popup-enter-active {
  animation: popup-in 2s ease;
}
.popup-leave-active {
  animation: popup-out 1s ease;
}

@keyframes popup-in {
  0% {
    transform: translateY(-12vw);
  }
  32% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes popup-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
