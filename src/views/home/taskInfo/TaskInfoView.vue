<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";

import { storeToRefs } from "pinia";
import { showNotify } from "vant";

import useLoginStore from "@/stores/login";
import useClassStore from "@/stores/class";
import useTaskStore from "@/stores/task";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";

import { formatDateToTimeStamp, formatDateTime } from "@/utils/formatTime";

const loginStore = useLoginStore();

const { userInfo } = storeToRefs(loginStore);

const classStore = useClassStore();
const taskStore = useTaskStore();

classStore.fetchClassListAction(userInfo.value.id);
const { classList } = storeToRefs(classStore);

const { taskList, errorInfo } = storeToRefs(taskStore);

watch(classList, () => {
  currClass.value = classList.value[0].id;
  taskStore.fetchTaskListAction(currClass.value);
  areaList.value = classList.value.map((item: any) => ({
    text: item.name,
    value: item.id,
  }));
});

const currClass = ref<number>(0);

const showPopover = ref(false);

const showArea = ref(false);
const areaList = ref();
const showPicker = ref(false);
const isStartTime = ref(false);
const start_time = ref("");
const end_time = ref("");

const taskInfo = reactive<{
  [idx: string]: any;
}>({});
const show = ref(false);
const title = ref("新增任务");

const actions = computed(() => {
  return classList.value?.map((item: any) => ({
    id: item.id,
    text: item.name,
  }));
});

function onSelect(item: any) {
  taskStore.fetchTaskListAction(item.id);
}

function onChange({ selectedOptions }: any) {
  showArea.value = false;
  taskInfo.class_name = selectedOptions[0].text;
  taskInfo.class_id = selectedOptions[0].value;
}

function onConfirmPicker({ selectedValues }: any) {
  const time = formatDateToTimeStamp(selectedValues.join("/"));
  if (isStartTime.value) {
    if (taskInfo.end_time < time) {
      showNotify({ message: "结束时间不能小于开始时间", duration: 800 });
      end_time.value = "";
      taskInfo.end_time = "";
      errorInfo.value = "";
    }
    start_time.value = selectedValues.join("/");
    taskInfo.start_time = time;
  } else {
    if (taskInfo.start_time > time || !taskInfo.start_time) {
      showNotify({ message: "结束时间不能小于开始时间", duration: 800 });
      errorInfo.value = "";
    } else {
      end_time.value = selectedValues.join("/");
      taskInfo.end_time = time;
    }
  }
  showPicker.value = false;
}

function addHandler() {
  title.value = "新增任务";
  start_time.value = "";
  end_time.value = "";
  for (const key in taskInfo) {
    taskInfo[key] = "";
  }
  show.value = true;
}

function updateHandler(item: any) {
  title.value = "修改任务";
  for (const key in item) {
    taskInfo[key] = item[key];
  }
  start_time.value = formatDateTime(+item.start_time, "YYYY/MM/DD");
  end_time.value = formatDateTime(+item.end_time, "YYYY/MM/DD");
  show.value = true;
}

async function removeHandler(id: number) {
  await taskStore.removeTaskAction(currClass.value, id);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
}

async function confirm() {
  if (title.value === "新增任务") {
    await taskStore.addTaskAction(currClass.value, taskInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  } else {
    await taskStore.updateTaskAction(currClass.value, taskInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  }
  show.value = false;
}
</script>

<template>
  <div class="task-info">
    <main-wrapper title="任务" :is-left-arrow="true">
      <template #navBarLeft>
        <van-space :size="'1rem'">
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
      <transition-group v-if="!show" name="card">
        <card-item
          v-for="item of taskList"
          :key="item.id"
          :item="item"
          label="姓名"
          @update="updateHandler(item)"
          @remove="removeHandler(item.id)"
        ></card-item>
      </transition-group>
      <div v-else>
        <div class="head">
          <span class="title">{{ title }}</span>
          <van-icon name="cross" @click="show = false" />
        </div>
        <van-form @submit="confirm">
          <van-cell-group inset>
            <van-field
              v-model="taskInfo.name"
              label="任务名称"
              placeholder="请输入任务名称"
            />
            <van-field
              v-model="taskInfo.class_name"
              is-link
              readonly
              name="area"
              label="班级选择"
              placeholder="点击选择班级"
              @click="showArea = true"
            />
            <van-field
              v-model="start_time"
              is-link
              readonly
              name="datePicker"
              label="开始时间"
              placeholder="点击选择时间"
              @click="
                showPicker = true;
                isStartTime = true;
              "
            />
            <van-field
              v-model="end_time"
              is-link
              readonly
              name="datePicker"
              label="结束时间"
              placeholder="点击选择时间"
              @click="
                showPicker = true;
                isStartTime = false;
              "
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
      <van-popup v-model:show="showArea" position="bottom">
        <van-picker
          :columns="areaList"
          @cancel="showArea = false"
          @confirm="onChange"
        />
      </van-popup>
      <van-popup v-model:show="showPicker" position="bottom">
        <van-date-picker
          :min-date="new Date()"
          :max-date="new Date(2025, 1, 1)"
          @confirm="onConfirmPicker"
          @cancel="showPicker = false"
        />
      </van-popup>
    </main-wrapper>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;

  padding: 4px 1.6rem;
  border-bottom: 1px solid #ccc;

  .title {
    font-size: 14px;
    color: rgb(166, 165, 165);
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
