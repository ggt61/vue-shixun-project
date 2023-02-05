import { ref } from "vue";

import { defineStore } from "pinia";
import {
  addClassRequest,
  getClassListRequest,
  updateClassRequest,
  removeClassRequest,
} from "@/service/modules/class";
import stroage from "@/utils/stroage";

const useClassStore = defineStore("classStore", () => {
  const classList = ref<any[]>([]);
  const errorInfo = ref("");

  async function fetchClassListAction(id: number) {
    const result = await getClassListRequest(id);
    if (result.code > 0) {
      classList.value = result.data;
    }
    return;
  }

  async function addClassAction(id: number, userName: string) {
    const result = await addClassRequest(id, userName);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchClassListAction(stroage.get("user").id);
  }

  async function updateClassAction(id: number, userName: string) {
    const result = await updateClassRequest(id, userName);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchClassListAction(stroage.get("user").id);
  }

  async function removeClassAction(id: number) {
    const result = await removeClassRequest(id);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchClassListAction(stroage.get("user").id);
  }

  return {
    classList,
    errorInfo,
    fetchClassListAction,
    addClassAction,
    updateClassAction,
    removeClassAction,
  };
});

export default useClassStore;
