import { ref } from "vue";

import { defineStore } from "pinia";
import {
  addStudentRequest,
  getStudentListRequest,
  updateStudentRequest,
  removeStudentRequest,
} from "@/service/modules/student";

const useStudentStore = defineStore("studentStore", () => {
  const studentList = ref();
  const errorInfo = ref("");

  async function fetchStudentListAction(id: number) {
    const result = await getStudentListRequest(id);
    if (result.code > 0) {
      studentList.value = result.data;
    }
  }

  async function addStudentAction(id: number, studentInfo: any) {
    const result = await addStudentRequest(studentInfo);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchStudentListAction(id);
  }

  async function updateStudentAction(id: number, studentInfo: any) {
    const result = await updateStudentRequest(studentInfo);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchStudentListAction(id);
  }

  async function removeStudentAction(class_id: number, id: number) {
    const result = await removeStudentRequest(id);
    if (result.code < 0) {
      errorInfo.value = result.message;
    }
    await fetchStudentListAction(class_id);
  }

  return {
    studentList,
    errorInfo,
    fetchStudentListAction,
    addStudentAction,
    updateStudentAction,
    removeStudentAction,
  };
});

export default useStudentStore;
