import { ref } from "vue";
import { defineStore } from "pinia";

import { loginRequest } from "@/service/modules/login";
import stroage from "@/utils/stroage";

const useLoginStore = defineStore("loginStore", () => {
  const data = ref();
  const token = ref();
  const userInfo = ref();

  function initializationAction() {
    token.value = stroage.get("token");
    userInfo.value = stroage.get("user");
  }

  async function loginAction(account: string, password: string) {
    const result = await loginRequest(account, password);
    if (result.code > 0) {
      stroage.set("token", result.data.token);
      stroage.set("user", result.data.user);

      token.value = result.data.token;
      userInfo.value = result.data.user;
    }
    data.value = result;
  }
  return {
    data,
    token,
    userInfo,
    initializationAction,
    loginAction,
  };
});

export default useLoginStore;
