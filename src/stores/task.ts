import { ref } from "vue";
import { defineStore } from "pinia";

import {
  getTaskListRequest,
  updateTaskRequest,
  removeTaskRequest,
  addTaskRequest,
} from "@/service/modules/task";

const useTaskStore = defineStore("taskStore", () => {
  const taskList = ref<any[]>([]);
  const errorInfo = ref<string>("");

  async function fetchTaskListAction(class_id: number) {
    const result = await getTaskListRequest(class_id);
    taskList.value = result.data;
  }

  async function addTaskAction(class_id: number, task_info: any) {
    const result = await addTaskRequest({ class_id, ...task_info });

    if (result.code < 0) {
      errorInfo.value = result.message;
    }

    await fetchTaskListAction(class_id);
  }
  async function updateTaskAction(class_id: number, task_info: any) {
    const result = await updateTaskRequest({ class_id, ...task_info });

    if (result.code < 0) {
      errorInfo.value = result.message;
    }

    await fetchTaskListAction(class_id);
  }
  async function removeTaskAction(class_id: number, id: number) {
    const result = await removeTaskRequest(id);

    if (result.code < 0) {
      errorInfo.value = result.message;
    }

    await fetchTaskListAction(class_id);
  }

  return {
    taskList,
    errorInfo,
    fetchTaskListAction,
    addTaskAction,
    updateTaskAction,
    removeTaskAction,
  };
});

export default useTaskStore;
