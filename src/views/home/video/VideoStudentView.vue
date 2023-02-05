<script setup lang="ts">
import { ref, reactive } from "vue";

import { storeToRefs } from "pinia";

import useVideoStore from "@/stores/video";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";
import stroage from "@/utils/stroage";
import { showNotify } from "vant";

const videoStore = useVideoStore();

const user = stroage.get("user");
// 获取视频列表
const { videoList, errorInfo } = storeToRefs(videoStore);
videoStore.fetchVideoListAction(user.class_id);

const videoInfo = reactive<{
  [idx: string]: any;
}>({});

const show = ref(false);
const title = ref("");

const video = ref<any[]>([]);

function addHandler() {
  title.value = "添加视频";
  for (const i in videoInfo) {
    videoInfo[i] = "";
  }
  show.value = true;
}

function updateHandler(item: any) {
  title.value = "修改视频";
  for (const i in item) {
    videoInfo[i] = item[i];
  }
  video.value.push({
    url: `http://localhost:3000/${videoInfo.filename}`,
  });
  videoInfo.url = `http://localhost:3000/${videoInfo.filename}`;
  show.value = true;
}

async function removeHandler(id: number) {
  await videoStore.removeVideoAction(user.class_id, id);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
}

async function confirm() {
  if (title.value === "添加视频") {
    await videoStore.addVideoAction(user.class_id, videoInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  } else {
    await videoStore.updateVideoAction(user.class_id, videoInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  }
  video.value = [];
  videoInfo.video = "";
  videoInfo.url = "";
}

function afterRead(file: any) {
  videoInfo.url = file.content;
  videoInfo.video = file.file;
}
</script>

<template>
  <div class="video-info">
    <main-wrapper title="视频管理" :is-left-arrow="true">
      <template #navBarLeft>
        <van-icon name="plus" size="5vw" @click="addHandler" />
      </template>

      <div v-if="!show" :style="{ display: 'flex', height: '100%' }">
        <div style="width: 100%">
          <transition-group name="card">
            <card-item
              v-for="item of videoList"
              :key="item.id"
              :item="item"
              label="视频名称"
              @update="updateHandler(item)"
              @remove="removeHandler(item.id)"
            ></card-item>
          </transition-group>
        </div>
      </div>

      <div v-else>
        <div class="head">
          <span>{{ title }}</span>
          <van-icon
            name="cross"
            @click="
              show = false;
              video = [];
              videoInfo.video = '';
              videoInfo.url = '';
            "
          />
        </div>
        <van-form @submit="confirm">
          <van-cell-group inset>
            <van-field
              required
              v-model="videoInfo.name"
              label="视频名称"
              placeholder="请输入视频名称"
            />
            <van-field
              required
              v-model="videoInfo.description"
              label="视频描述"
              placeholder="请输入视频描述"
            />

            <van-field name="uploader" label="文件">
              <template #input>
                <van-uploader
                  v-model="video"
                  accept="video/*"
                  :max-count="1"
                  preview-size="100px"
                  :after-read="afterRead"
                >
                  <template #preview-cover>
                    <video
                      v-if="videoInfo.video || videoInfo.url"
                      style="width: 100px; height: 100px; object-fit: cover"
                      :src="videoInfo.url"
                    ></video>
                  </template>
                </van-uploader>
              </template>
            </van-field>
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
.video-info {
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
