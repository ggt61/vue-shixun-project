<script setup lang="ts">
import { storeToRefs } from "pinia";

import useClassStore from "@/stores/class";
import useTaskStore from "@/stores/task";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import stroage from "@/utils/stroage";
import { formatDateTime } from "@/utils/formatTime";

const user = stroage.get("user");

const classStore = useClassStore();
const taskStore = useTaskStore();

classStore.fetchClassListAction(user.class_id);

const { taskList } = storeToRefs(taskStore);
taskStore.fetchTaskListAction(user.class_id);
</script>

<template>
  <div class="task-info">
    <main-wrapper title="任务" :is-left-arrow="true">
      <transition-group name="card">
        <div v-for="item of taskList" :key="item.id">
          <div class="task-container">
            <div class="left">
              <div class="name">任务名称: {{ item.name }}</div>
              <div class="time">
                <div class="start-time">
                  开始时间: {{ formatDateTime(+item.start_time, "YYYY-MM-DD") }}
                </div>
                <div class="end-time">
                  结束时间: {{ formatDateTime(+item.end_time, "YYYY-MM-DD") }}
                </div>
              </div>
            </div>
            <div class="right">
              <div class="info">
                <div v-if="item.end_time < new Date()" style="color: red">
                  已过期
                </div>
                <div v-else style="color: greenyellow">执行中</div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.task-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22vw;

  margin: 2vw;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0 2vw;
  background: rgb(250, 250, 250);

  box-sizing: border-box;
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    height: 100%;

    .time {
      font-size: 14px;
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
