<script setup lang="ts">
interface IItem {
  id: number;
  name: string;
  rightIcon?: string;
}
interface IProps {
  label?: string;
  item: IItem;
}

withDefaults(defineProps<IProps>(), {
  label: "班级",
});

const emit = defineEmits<{
  (e: "update", id: number): void;
  (e: "remove", id: number): void;
}>();

function onUpdate(id: number) {
  emit("update", id);
}
function onRemove(id: number) {
  emit("remove", id);
}
</script>

<template>
  <div class="card-item" @click="onUpdate(item.id)">
    <div class="info">
      <div class="name">{{ label }}: {{ item.name }}</div>
    </div>
    <div
      v-if="item.rightIcon !== ''"
      class="left-icon"
      @click.stop="onRemove(item.id)"
    >
      <van-icon :name="item.rightIcon ?? 'close'" color="blue" size="24px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22vw;

  margin: 2vw;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0 2vw;
  background: rgb(250, 250, 250);

  box-sizing: border-box;

  .left-icon {
    display: flex;
    justify-content: center;
    width: 10%;
  }
}
</style>
