<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import useClassStore from "@/stores/class";
import useVideoStore from "@/stores/video";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";
import stroage from "@/utils/stroage";

const classStore = useClassStore();
const videoStore = useVideoStore();
// 获取班级列表
classStore.fetchClassListAction(stroage.get("user").id);
const { classList } = storeToRefs(classStore);
const { videoList } = storeToRefs(videoStore);

const currClass = ref();
watch(classList, () => {
  currClass.value = classList.value[0];
  videoStore.fetchVideoListAction(currClass.value.id);
});

const active = ref(0);
const isShow = ref(false);

const startX = ref<number>(0);
const startTime = ref();

const showVideo = ref(false);

const videoName = ref<string>();

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
  videoStore.fetchVideoListAction(currClass.value.id);
}

function checkVideo(name: string) {
  videoName.value = name;
  showVideo.value = true;
}
</script>

<template>
  <div class="video-info">
    <main-wrapper title="视频管理" :is-left-arrow="true">
      <div
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
          <transition-group name="card" v-if="!showVideo">
            <div
              v-for="item of videoList"
              :key="item.id"
              class="card"
              @click="checkVideo(item.filename)"
            >
              <div class="name">视频名称: {{ item.name }}</div>
            </div>
          </transition-group>
          <div v-else>
            <div class="nav-top">
              <span>视频展示</span>
              <van-icon name="cross" @click="showVideo = false" />
            </div>
            <video
              class="video"
              controls
              :src="`http://localhost:3000/${videoName}`"
            ></video>
          </div>
        </div>
      </div>
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.video-info {
  position: relative;
  height: 100vh;
  .selection {
    overflow: hidden;
    transition: all 0.5s ease;
  }
  .video {
    width: 100%;
  }
  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 15px rgba(238, 238, 238, 0.778);
    padding: 0.6rem 0.4rem;
    background: #fff;
    font-size: 14px;
  }
  .card {
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
