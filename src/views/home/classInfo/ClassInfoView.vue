<script setup lang="ts">
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";

import { showNotify } from "vant";

import useLoginStore from "@/stores/login";
import useClassStore from "@/stores/class";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";

const loginStore = useLoginStore();
const classStore = useClassStore();

const { userInfo } = storeToRefs(loginStore);
classStore.fetchClassListAction(userInfo.value.id);

const { classList, errorInfo } = storeToRefs(classStore);

const show = ref(false);
const title = ref("");
const classInfo = reactive({
  id: 0,
  name: "",
});

function addHandler() {
  title.value = "添加班级";
  show.value = true;
}
async function confirm() {
  if (title.value === "添加班级") {
    await classStore.addClassAction(userInfo.value.id, classInfo.name);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  } else {
    await classStore.updateClassAction(classInfo.id, classInfo.name);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  }
  show.value = false;
}

function updateHandler(item: any) {
  title.value = "修改班级";
  show.value = true;
  classInfo.name = item.name;
  classInfo.id = item.id;
}
async function removeHandler(id: number) {
  await classStore.removeClassAction(id);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
}
</script>

<template>
  <div class="class-info">
    <main-wrapper title="班级管理" :is-left-arrow="true">
      <template #navBarLeft>
        <van-icon name="plus" size="5vw" @click="addHandler" />
      </template>
      <transition-group name="card" v-if="!show">
        <card-item
          v-for="item of classList"
          :key="item.id"
          :item="item"
          @update="updateHandler(item)"
          @remove="removeHandler(item.id)"
        ></card-item>
      </transition-group>
      <div v-else>
        <div class="head">
          <span>{{ title }}</span>
          <van-icon name="cross" @click="show = false" />
        </div>
        <van-form @submit="confirm">
          <van-cell-group inset>
            <van-field
              v-model="classInfo.name"
              label="班级"
              placeholder="请输入班级名称"
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;

  padding: 4px 1.6rem;
  border-bottom: 1px solid #ccc;
  .title {
    font-size: 14px;
    color: rgb(166, 165, 165);
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
