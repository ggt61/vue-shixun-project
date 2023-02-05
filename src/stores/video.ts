import { ref } from "vue";
import { defineStore } from "pinia";

import {
  getVideoListRequest,
  addVideoRequest,
  updateVideoRequest,
  removeVideoRequest,
} from "@/service/modules/video";
import stroage from "@/utils/stroage";

const useVideoStore = defineStore("videoStore", () => {
  const videoList = ref<any[]>([]);
  const errorInfo = ref();
  const user = stroage.get("user");

  async function fetchVideoListAction(classId: number) {
    const result = await getVideoListRequest(classId);

    if (result.code > 0) {
      videoList.value = result.data.map((item: any) => ({
        ...item,
        rightIcon: user.jurisdiction ? "play-circle-o" : "close",
      }));
    }
  }

  async function addVideoAction(classId: number, data: any) {
    const result = await addVideoRequest({ class_id: classId, ...data });

    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    fetchVideoListAction(classId);
  }

  async function updateVideoAction(classId: number, data: any) {
    const result = await updateVideoRequest({ class_id: classId, ...data });

    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchVideoListAction(classId);
  }

  async function removeVideoAction(classId: number, id: number) {
    const result = await removeVideoRequest(id);

    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchVideoListAction(classId);
  }

  return {
    videoList,
    errorInfo,
    fetchVideoListAction,
    addVideoAction,
    updateVideoAction,
    removeVideoAction,
  };
});

export default useVideoStore;
