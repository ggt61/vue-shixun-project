<script setup lang="ts">
import useDiscussStore from "@/stores/discuss";
import { ref } from "vue";

interface IUser {
  id: number;
  name: string;
  account: string;
  class_id?: number;
  avatar?: string;
}

interface IMoment {
  id: number;
  content: string;
  replyCount: number;
  create_time: string;
  user: IUser;
}

interface IComment {
  id: number;
  create_time: string;
  content: string;
  user: IUser;
}

interface IProps {
  momentInfo: IMoment;
  replyList: IComment[];
  user: IUser;
}

const props = withDefaults(defineProps<IProps>(), {});
const emits = defineEmits(["update:modelValue"]);

const discussStore = useDiscussStore();

const show = ref(false);
const message = ref("");

const currMoment = ref<any>();

async function onReply(item: any) {
  currMoment.value = item;
  show.value = true;
}

async function onCancel() {
  const info = {
    content: message.value,
    moment_id: props.momentInfo.id,
    user_id: props.user.id,
  };
  if (props.momentInfo.user.id !== currMoment.value.user.id) {
    info.content = `@${currMoment.value.user.name} ` + info.content;
  }
  await discussStore.addReplyAction(info);
  await discussStore.fetchReplyListAction(props.momentInfo.id);

  show.value = false;
  message.value = "";
}

async function onRemove(id: number, isMoment: boolean = false) {
  discussStore.removeReplyAction(props.momentInfo.id, id);
  if (isMoment) {
    emits("update:modelValue", false);
  }
}

async function croseHandler() {
  await discussStore.fetchMomentListAction(props.user.class_id!);
  emits("update:modelValue", false);
}
</script>

<template>
  <div class="reply">
    <van-sticky>
      <div class="nav-top">
        <span>回复详情</span>
        <van-icon name="cross" @click="croseHandler" />
      </div>
    </van-sticky>
    <div class="moment-contanier">
      <div class="user-avatar">
        <van-image
          round
          width="2.4rem"
          height="2.4rem"
          :src="momentInfo.user.avatar"
        />
      </div>
      <div class="content-warpper">
        <div class="user-info">
          <div class="name">{{ momentInfo.user.name }}</div>
          <div class="create-time">{{ momentInfo.create_time }}</div>
        </div>
        <div class="moment-content">
          <div class="moment-container van-multi-ellipsis--l3">
            <span>{{ momentInfo.content }}</span>
          </div>
          <div class="moment-info">
            <div class="reply-info">
              <span
                class="reply van-haptics-feedback"
                @click="onReply(momentInfo)"
              >
                回复
              </span>
              <span
                v-if="momentInfo.user.id === user.id"
                class="delete van-haptics-feedback"
                @click="onRemove(momentInfo.id, true)"
              >
                删除
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-top">共{{ momentInfo.replyCount }}条回复</div>
    <transition-group name="card">
      <div class="reply-contanier" v-for="item of replyList" :key="item.id">
        <div class="user-avatar">
          <van-image
            round
            width="2.4rem"
            height="2.4rem"
            :src="item.user.avatar"
          />
        </div>
        <div class="content-warpper">
          <div class="user-info">
            <div class="name">{{ item.user.name }}</div>
            <div class="create-time">{{ item.create_time }}</div>
          </div>
          <div class="moment-content">
            <div class="moment-container van-multi-ellipsis--l3">
              <span>{{ item.content }}</span>
            </div>
            <div class="moment-info">
              <div class="reply-info">
                <span class="reply van-haptics-feedback" @click="onReply(item)">
                  回复
                </span>
                <span
                  v-if="item.user.id === user.id"
                  class="delete van-haptics-feedback"
                  @click="onRemove(item.id)"
                >
                  删除
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    <van-action-sheet
      v-model:show="show"
      title="发布信息"
      :close-icon="message ? 'passed' : 'close'"
      @cancel="onCancel"
    >
      <van-cell-group inset style="padding: 16px 16px 24px">
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请输入内容"
          show-word-limit
        />
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>

<style scoped lang="scss">
.reply {
  position: relative;
  background: #fff;
  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 15px rgba(238, 238, 238, 0.778);
    padding: 0.6rem 0.4rem;
    background: #fff;
    font-size: 14px;
  }
}
.moment-contanier {
  position: relative;
  padding: 1rem 0 0.4rem 3.4rem;
  border-bottom: 0.5rem solid #eeeeee;
}
.reply-contanier {
  position: relative;
  padding: 1rem 0 0.4rem 3.4rem;
  border-bottom: 1px solid #eeeeee;
}

.user-avatar {
  position: absolute;
  transform: translateX(-120%);
}
.content-warpper {
  padding-right: 0.6rem;
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 2.4rem;
    .name {
      display: flex;
      align-items: center;
    }
    .create-time {
      font-size: 0.6rem;
      color: rgb(164, 164, 164);
    }
  }
  .moment-content {
    margin-top: 2vw;
    .moment-container {
      font-size: 0.8rem;
    }
    .moment-info {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.5rem;
      .reply {
        margin-right: 0.6rem;
        color: blue;
      }
      .delete {
        color: red;
      }
      .more {
        color: rgb(95, 95, 95);
      }
    }
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
