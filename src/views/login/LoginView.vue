<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

import useLoginStore from "@/stores/login";
import { storeToRefs } from "pinia";
import { getRoutesByJurisdiction } from "@/utils/getRoutesByJurisdiction";

const router = useRouter();

const loginStore = useLoginStore();
const { data } = storeToRefs(loginStore);

const account = ref("");
const password = ref("");

async function onSubmit() {
  if (!validator()) {
    return;
  }

  await loginStore.loginAction(account.value, password.value);
  if (data.value.code > 0) {
    // 根据权限注册路由
    getRoutesByJurisdiction().forEach((item: any) => {
      router.addRoute("/home", item);
    });
    router.push("/home");
  } else {
    showToast({
      message: data.value.message,
      position: "top",
    });
  }
}

function validator(): boolean {
  if (!account.value || !password.value) {
    showToast({
      message: "账号或密码不能为空",
      position: "top",
    });
    return false;
  }
  return true;
}
</script>

<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="account"
          label-width="4rem"
          name="用户名"
          label="用户名"
          left-icon="user-o"
          placeholder="用户名"
        />
        <van-field
          v-model="password"
          label-width="4rem"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
        >
          <template #left-icon>
            <van-icon class-prefix="iconfont icon" name="mima" />
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
</template>

<style scoped lang="scss">
.login {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background: url("@/assets/image/login-bg.svg");
}
.msg-box {
  border: 1px solid rgb(238, 238, 238);
  border-radius: 30px;
  padding: 6px 14px;
}
</style>
