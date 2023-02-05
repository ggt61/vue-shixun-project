<script setup lang="ts">
interface IProps {
  title: string;
  leftText?: string;
  isLeftArrow?: boolean;
}

withDefaults(defineProps<IProps>(), {
  leftText: "返回",
  isLeftArrow: false,
});

const onClickLeft = () => history.back();
</script>

<template>
  <div class="main-wrapper">
    <van-nav-bar
      :title="title"
      :left-text="isLeftArrow ? leftText : ''"
      :left-arrow="isLeftArrow"
      @click-left="onClickLeft"
    >
      <template #right>
        <slot name="navBarLeft"></slot>
      </template>
    </van-nav-bar>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.main-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
