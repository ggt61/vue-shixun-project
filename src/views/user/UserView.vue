<script setup lang="ts">
import { ref, watch } from "vue";
import { showToast } from "vant";

import useUserStore from "@/stores/user";

import stroage from "@/utils/stroage";
import router from "@/router";
import { storeToRefs } from "pinia";

const user = stroage.get("user");

const userStore = useUserStore();
const { message, avatar } = storeToRefs(userStore);
userStore.getUserAvatarAction(user.id);

const uploaderRef = ref();

watch(message, () => {
  showToast({
    message: message.value,
    position: "top",
  });
});

const show = ref(false);

const oldPassword = ref("");
const newPassword = ref("");

const showPopover = ref(false);
const actions = [
  { text: "修改密码", icon: "lock" },
  { text: "退出登录", icon: "clear" },
];

function changePortrait() {
  // 打开文件管理器, 用于上传头像
  uploaderRef.value.chooseFile();
}

function onSelect(_: any, index: number) {
  switch (index) {
    case 0:
      oldPassword.value = "";
      newPassword.value = "";
      show.value = true;
      break;
    case 1:
      stroage.clear();
      router.push("/home");
      break;
  }
}

async function afterRead(file: any) {
  await userStore.changeUserAvatarAction({ avatar: file.file });
  userStore.getUserAvatarAction(user.id);
}

function confirm() {
  userStore.changePasswordAction(oldPassword.value, newPassword.value);
}
</script>

<template>
  <div class="user">
    <div class="options">
      <van-popover
        v-model:show="showPopover"
        placement="bottom-end"
        :actions="actions"
        :show-arrow="false"
        @select="onSelect"
      >
        <template #reference>
          <van-icon name="more-o" color="#fff" size="7vw" />
        </template>
      </van-popover>
    </div>
    <div class="header">
      <div class="bg"></div>
      <div class="head-portrait" @click="changePortrait">
        <van-image fit="cover" round width="20vw" height="20vw" :src="avatar" />
      </div>
      <van-uploader
        ref="uploaderRef"
        style="display: none"
        max-count="1"
        :after-read="afterRead"
      />
      <!-- <div class="more">个人主页 ></div> -->
    </div>
    <div class="info">
      <p>{{ user.name }}</p>
    </div>
    <van-divider />
    
    <van-dialog
      v-model:show="show"
      :title="'修改密码'"
      show-cancel-button
      @confirm="confirm"
    >
      <van-field
        v-model="oldPassword"
        label="原密码"
        placeholder="请输入原密码"
        required
      />
      <van-field
        v-model="newPassword"
        label="新密码"
        placeholder="请输入新密码"
        required
      />
    </van-dialog>
  </div>
</template>

<style scoped lang="scss">
.user {
  position: relative;
  .options {
    position: absolute;
    top: 2vw;
    right: 3vw;
    z-index: 3;
  }
  .header {
    position: relative;
    .bg {
      height: 26vw;
      background: red;
    }
    .head-portrait {
      position: absolute;
      left: 24px;
      transform: translateY(-30%);
    }
    .more {
      position: absolute;
      right: 14px;
      bottom: -7.5vw;
    }
  }
  .info {
    margin-top: 18vw;
    margin-left: 2vw;
  }
}
</style>
