<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { storeToRefs } from "pinia";

import useClassStore from "@/stores/class";
import useStudentStore from "@/stores/student";

import { showNotify } from "vant";

import MainWrapper from "@/components/mainWrapper/MainWrapperView.vue";
import CardItem from "@/components/cardItem/CardItemView.vue";
import stroage from "@/utils/stroage";

const classStore = useClassStore();
const studentStore = useStudentStore();
// 获取班级列表
classStore.fetchClassListAction(stroage.get("user").id);
const { classList } = storeToRefs(classStore);
const { studentList, errorInfo } = storeToRefs(studentStore);

const currClass = ref();
watch(classList, () => {
  currClass.value = classList.value[0];
  studentStore.fetchStudentListAction(currClass.value.id);
  areaList.value = classList.value.map((item: any) => ({
    text: item.name,
    value: item.id,
  }));
});

const active = ref(0);
const isShow = ref(false);
const show = ref(false);

const showArea = ref(false);
const areaList = ref();

const title = ref("新增学生");

const studentInfo = reactive<{
  [idx: string]: any;
}>({});

const startX = ref<number>(0);
const startTime = ref();

// 右滑实现
function onTouchStart(e: TouchEvent) {
  startTime.value = Date.now();
  startX.value = e.changedTouches[0].clientX;
}
function onTouchEnd(e: TouchEvent) {
  const endX = e.changedTouches[0].clientX;
  if (Math.abs(startTime.value - Date.now()) < 100) {
    return;
  }
  if (Math.floor(startX.value) - Math.floor(endX) < -10) {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
}

function changeAside(index: number) {
  currClass.value = classList.value[index];
  studentStore.fetchStudentListAction(currClass.value.id);
}

function onChange({ selectedOptions }: any) {
  showArea.value = false;
  studentInfo.class_name = selectedOptions[0].text;
  studentInfo.class_id = selectedOptions[0].value;
}

function addHandler() {
  title.value = "新增学生";
  show.value = true;
  for (const key in studentInfo) {
    studentInfo[key] = "";
  }
}

function updateHandler(item: any) {
  title.value = "编辑学生";
  show.value = true;
  for (const key in item) {
    studentInfo[key] = item[key];
  }
}

async function removeHandler(id: number) {
  await studentStore.removeStudentAction(currClass.value.id, id);
  if (errorInfo.value) {
    showNotify({ message: errorInfo.value, duration: 800 });
    errorInfo.value = "";
  }
}

async function confirm() {
  if (title.value === "新增学生") {
    await studentStore.addStudentAction(currClass.value.id, studentInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  } else {
    await studentStore.updateStudentAction(currClass.value.id, studentInfo);
    if (errorInfo.value) {
      showNotify({ message: errorInfo.value, duration: 800 });
      errorInfo.value = "";
    }
  }
  show.value = false;
}
</script>

<template>
  <div class="student-info">
    <main-wrapper title="学生管理" :is-left-arrow="true">
      <template #navBarLeft>
        <van-icon name="plus" size="5vw" @click="addHandler" />
      </template>

      <div
        :style="{ display: 'flex', height: '100%' }"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        v-if="!show"
      >
        <div
          class="selection"
          :style="{
            width: isShow ? '80px' : '0',
            borderRight: isShow ? '1px solid #ccc' : '',
          }"
        >
          <van-sidebar v-model="active">
            <van-sidebar-item
              v-for="item of classList"
              :key="item.id"
              :title="item.name"
              @click="changeAside"
            />
          </van-sidebar>
        </div>
        <div style="width: 100%">
          <transition-group name="card">
            <card-item
              v-for="item of studentList"
              :key="item.id"
              :item="item"
              label="姓名"
              @update="updateHandler(item)"
              @remove="removeHandler(item.id)"
            ></card-item>
          </transition-group>
        </div>
      </div>
      <div v-else>
        <div class="head">
          <span class="title">{{ title }}</span>
          <van-icon name="cross" @click="show = false" />
        </div>
        <van-form @submit="confirm">
          <van-cell-group inset>
            <van-field
              v-model="studentInfo.account"
              label="账号"
              placeholder="请输入账号"
            />
            <van-field
              v-model="studentInfo.class_name"
              is-link
              readonly
              name="area"
              label="班级选择"
              placeholder="点击选择班级"
              @click="showArea = true"
            />

            <van-field
              v-model="studentInfo.name"
              label="学生姓名"
              placeholder="请输入班级学生姓名"
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

.student-info {
  position: relative;
  height: 100vh;
  .selection {
    overflow: hidden;
    transition: all 0.5s ease;
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
