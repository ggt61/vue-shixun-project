import { ref } from "vue";
import { defineStore } from "pinia";

import {
  getResourceListRequest,
  addResourceRequest,
  removeResourceRequest,
} from "@/service/modules/resource";

const useResourceStore = defineStore("resourceStore", () => {
  const resourceList = ref<any[]>([]);
  const errorInfo = ref();

  async function fetchResourceListAction(classId: number) {
    const result = await getResourceListRequest(classId);
    if (result.code > 0) {
      resourceList.value = result.data;
    }
  }
  async function addResourceAction(classId: number, resourceInfo: any) {
    const result = await addResourceRequest({
      ...resourceInfo,
      class_id: classId,
    });
    if (result.code < 0) {
      errorInfo.value = result.message;
    }

    await fetchResourceListAction(classId);
  }
  async function removeResourceAction(classId: number, id: number) {
    const result = await removeResourceRequest(id);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }

    await fetchResourceListAction(classId);
  }

  return {
    resourceList,
    errorInfo,
    fetchResourceListAction,
    addResourceAction,
    removeResourceAction,
  };
});

export default useResourceStore;
