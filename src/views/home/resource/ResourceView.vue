<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { storeToRefs } from "pinia";

import useClassStore from "@/stores/class";
import useResourceStore from "@/stores/resource";

import { showNotify } from "vant";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";
import stroage from "@/utils/stroage";

const classStore = useClassStore();
const resourceStore = useResourceStore();
// 获取班级列表
classStore.fetchClassListAction(stroage.get("user").id);
const { classList } = storeToRefs(classStore);
const { resourceList, errorInfo } = storeToRefs(resourceStore);

const currClass = ref();
watch(classList, () => {
  currClass.value = classList.value[0];
  resourceStore.fetchResourceListAction(currClass.value.id);
});

const active = ref(0);
const isShow = ref(false);
const show = ref(false);
const checked = ref("file");

const title = ref("新增资源");

const resourceInfo = reactive<{
  [idx: string]: any;
}>({});

const startX = ref<number>(0);
const startTime = ref();

// 右滑实现
function onTouchStart(e: TouchEvent) {
  startTime.value = Date.now();
  startX.value = e.changedTouches[0].clientX;
}
function onTouchEnd(e: TouchEvent) {
  const endX = e.changedTouches[0].clientX;
  if (Math.abs(startTime.value - Date.now()) < 100) {
    return;
  }
  if (Math.floor(startX.value) - Math.floor(endX) < -10) {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
}

function changeAside(index: number) {
  currClass.value = classList.value[index];
  resourceStore.fetchResourceListAction(currClass.value.id);
}

function addHandler() {
  title.value = "新增资源";
  show.value = true;
  for (const key in resourceInfo) {
    resourceInfo[key] = "";
  }
}

async function removeHandler(id: number) {
  await resourceStore.removeResourceAction(currClass.value.id, id);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
}

async function confirm() {
  await resourceStore.addResourceAction(currClass.value.id, resourceInfo);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
  show.value = false;
}

function afterRead(file: any) {
  resourceInfo.resource = file.file;
}

function onChange(name: string) {
  resourceInfo.mimetype = name;
}
</script>

<template>
  <div class="resource-info">
    <main-wrapper title="资源管理" :is-left-arrow="true">
      <template #navBarLeft>
        <van-icon name="plus" size="5vw" @click="addHandler" />
      </template>

      <div
        v-if="!show"
        :style="{ display: 'flex', height: '100%' }"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div
          class="selection"
          :style="{
            width: isShow ? '80px' : '0',
            borderRight: isShow ? '1px solid #ccc' : '',
          }"
        >
          <van-sidebar v-model="active">
            <van-sidebar-item
              v-for="item of classList"
              :key="item.id"
              :title="item.name"
              @click="changeAside"
            />
          </van-sidebar>
        </div>
        <div style="width: 100%">
          <transition-group name="card">
            <card-item
              v-for="item of resourceList"
              :key="item.id"
              :item="item"
              label="资源名称"
              @remove="removeHandler(item.id)"
            ></card-item>
          </transition-group>
        </div>
      </div>
      <div v-else>
        <div class="head">
          <span class="title">{{ title }}</span>
          <van-icon name="cross" @click="show = false" />
        </div>
        <van-form @submit="confirm">
          <van-cell-group inset>
            <van-field
              v-model="resourceInfo.resource_name"
              required
              label="资源名称"
              placeholder="请输入资源名称"
            />
            <van-field name="radio" label="资源类型">
              <template #input>
                <van-radio-group
                  v-model="checked"
                  direction="horizontal"
                  @change="onChange"
                >
                  <van-radio name="file">文件</van-radio>
                  <van-radio name="text">链接</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-if="resourceInfo.mimetype !== 'text'"
              name="uploader"
              label="文件"
            >
              <template #input>
                <van-uploader
                  :upload-icon="resourceInfo.resource ? 'checked' : 'add'"
                  :after-read="afterRead"
                  max-count="1"
                />
              </template>
            </van-field>
            <van-field
              v-model="resourceInfo.link"
              name="pattern"
              label="链接"
              placeholder="请输入链接"
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
