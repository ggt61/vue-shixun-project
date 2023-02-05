import { ref } from "vue";
import { defineStore } from "pinia";

import {
  changePasswordRequest,
  changeUserAvatarRequest,
  getUserAvatarRequest,
} from "@/service/modules/user";

const useUserStore = defineStore("userStore", () => {
  const message = ref("");
  const avatar = ref("");

  async function changePasswordAction(
    oldPassword: string,
    newPassword: string
  ) {
    const result = await changePasswordRequest(oldPassword, newPassword);
    message.value = result.message;
  }

  async function changeUserAvatarAction(data: any) {
    const result = await changeUserAvatarRequest(data);
    message.value = result.message;
  }

  async function getUserAvatarAction(userId: number) {
    const result = await getUserAvatarRequest(userId);
    avatar.value = result;
  }

  return {
    avatar,
    message,
    changePasswordAction,
    changeUserAvatarAction,
    getUserAvatarAction,
  };
});

export default useUserStore;
