<script setup lang="ts">
import { ref, computed, watch } from "vue";

import useLoginStore from "@/stores/login";
import useDiscussStore from "@/stores/discuss";
import useClassStore from "@/stores/class";
import type { IMoment } from "@/stores/discuss";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import ReplyView from "./cpns/replyView.vue";
import { storeToRefs } from "pinia";

const loginStore = useLoginStore();

const { userInfo } = storeToRefs(loginStore);

const classStore = useClassStore();
const discussStore = useDiscussStore();

classStore.fetchClassListAction(userInfo.value.id);
const { classList } = storeToRefs(classStore);

watch(classList, () => {
  currClass.value = classList.value[0].id;
  discussStore.fetchMomentListAction(currClass.value);
});

const { momentList, replyList } = storeToRefs(discussStore);
const currClass = ref<number>(0);

const showReply = ref(false);
const currMoment = ref<any>();
const currMomentId = ref<number>(-1);

const isReply = ref(false);

const show = ref(false);
const message = ref("");

const showPopover = ref(false);
const actions = computed(() => {
  return classList.value?.map((item: any) => ({
    id: item.id,
    text: item.name,
  }));
});

function onSelect(item: any) {
  discussStore.fetchMomentListAction(item.id);
}

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
    await discussStore.fetchMomentListAction(userInfo.value.class_id);
  }
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
        <van-space v-if="!showReply" :size="'1rem'">
          <van-popover
            v-model:show="showPopover"
            placement="bottom-end"
            :actions="actions"
            @select="onSelect"
          >
            <template #reference>
              <van-icon name="exchange" />
            </template>
          </van-popover>
          <van-icon name="plus" @click="addHandler" />
        </van-space>
      </template>

      <div style="position: relative">
        <transition name="van-slide-right">
          <van-list v-if="!showReply">
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
                  :src="item?.user?.avatar ?? ''"
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
                    <div class="more van-haptics-feedback">
                      <span @click="seeAllReply(item)">查看所有回复 ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
          <div v-else style="position: absolute; top: 0; width: 100%">
            <reply-view
              v-model="showReply"
              :moment-info="currMoment"
              :reply-list="replyList"
              :user="{
                ...userInfo,
                class_id: currClass,
              }"
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
</style>
