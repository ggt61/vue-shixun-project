<script setup lang="ts">
import { ref } from "vue";

import useLoginStore from "@/stores/login";
import useDiscussStore from "@/stores/discuss";
import type { IMoment } from "@/stores/discuss";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import ReplyView from "./cpns/replyView.vue";
import { storeToRefs } from "pinia";

const loginStore = useLoginStore();

const { userInfo } = storeToRefs(loginStore);

const discussStore = useDiscussStore();

discussStore.fetchMomentListAction(userInfo.value.class_id);

const { momentList, replyList } = storeToRefs(discussStore);

const showReply = ref(false);
const currMoment = ref<any>();
const currMomentId = ref<number>(-1);

const isReply = ref(false);

const show = ref(false);
const message = ref("");

function seeAllReply(item: IMoment) {
  currMoment.value = item;
  discussStore.fetchReplyListAction(item.id);
  showReply.value = true;
}

function addHandler(moment_id?: number) {
  if (moment_id) {
    isReply.value = true;
    currMomentId.value = moment_id;
  } else {
    isReply.value = false;
  }
  show.value = true;
}

async function onCancel() {
  if (message.value && !isReply.value) {
    discussStore.addMomentAction({
      content: message.value,
      class_id: userInfo.value.class_id,
      user_id: userInfo.value.id,
    });
  } else if (message.value && isReply.value) {
    await discussStore.addReplyAction({
      content: message.value,
      moment_id: currMomentId.value,
      user_id: userInfo.value.id,
    });
    isReply.value = false;
  }
  await discussStore.fetchMomentListAction(userInfo.value.class_id);

  message.value = "";
  show.value = false;
}

function onRemove(id: number) {
  discussStore.removeMomentAction(userInfo.value.class_id, id);
}
</script>

<template>
  <div class="discuss-manager">
    <main-wrapper title="讨论" :is-left-arrow="true">
      <template #navBarLeft>
        <van-icon v-if="!showReply" name="plus" @click="addHandler(0)" />
      </template>

      <div style="position: relative">
        <transition name="van-slide-right">
          <van-list v-if="!showReply">
            <transition-group name="card">
              <div
                class="moment-contanier"
                v-for="item of momentList"
                :key="item.id"
              >
                <div class="user-avatar">
                  <van-image
                    round
                    width="2.4rem"
                    height="2.4rem"
                    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                  />
                </div>
                <div class="content-warpper">
                  <div class="user-info">
                    <div class="name">{{ item.user.name }}</div>
                    <div class="create-time">{{ item.create_time }}</div>
                  </div>
                  <div class="moment-content">
                    <span class="moment-container">
                      {{ item.content }}
                    </span>
                    <div class="moment-info">
                      <div class="reply-info">
                        <span class="reply-count"
                          >共{{ item.replyCount }}条回复
                        </span>
                        <span
                          class="reply van-haptics-feedback"
                          @click="addHandler(item.id)"
                        >
                          回复
                        </span>
                        <span
                          v-if="item.user.id === userInfo.id"
                          class="delete van-haptics-feedback"
                          @click="onRemove(item.id)"
                        >
                          删除
                        </span>
                      </div>
                      <div
                        v-if="item.replyCount"
                        class="more van-haptics-feedback"
                      >
                        <span @click="seeAllReply(item)">查看所有回复 ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </van-list>
          <div v-else style="position: absolute; top: 0; width: 100%">
            <reply-view
              v-model="showReply"
              :moment-info="currMoment"
              :reply-list="replyList"
              :user="userInfo"
            ></reply-view>
          </div>
        </transition>
      </div>
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
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.moment-contanier {
  position: relative;
  padding: 1rem 0 0.4rem 3.4rem;
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
      .moment-info {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: 0.5rem;
        .reply {
          color: blue;
          margin: 0 0.6rem;
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
