import { ref } from "vue";

import { defineStore } from "pinia";
import dayjs from "dayjs";
import {
  addMomentRequest,
  addReplyRequest,
  getMomentListRequest,
  getReplyListReqest,
  removeMomentRequest,
  removeReplyRequest,
} from "@/service/modules/discuss";
import { getUserAvatarRequest } from "@/service/modules/user";

interface IUser {
  id: number;
  name: string;
  account: string;
  avatar?: string;
}

interface IComment {
  id: number;
  content: string;
  create_time: string;
  user: IUser;
}

export interface IMoment {
  id: number;
  content: string;
  replyCount: number;
  create_time: string;
  user: IUser;
}

const useDiscussStore = defineStore("discussStore", () => {
  const momentList = ref<IMoment[]>([]);
  const replyList = ref<IComment[]>([]);

  async function fetchMomentListAction(class_id: number) {
    const result = await getMomentListRequest(class_id);

    momentList.value = result.data.map((item: IMoment) => {
      return {
        ...item,
        create_time: dayjs(item.create_time).format("YYYY-MM-DD"),
      };
    });
    fetchUserAvatarAction();
  }

  async function fetchUserAvatarAction() {
    const map = new Map();

    // 获取用户头像;
    for (const item of momentList.value) {
      if (!map.get(item.user.id)) {
        const result = await getUserAvatarRequest(item.user.id);
        item.user.avatar = result;
        map.set(item.user.id, result);
      } else {
        item.user.avatar = map.get(item.user.id);
      }
    }
  }

  async function fetchReplyListAction(moment_id: number) {
    const result = await getReplyListReqest(moment_id);

    replyList.value = result.data.map((item: IComment) => {
      return {
        ...item,
        create_time: dayjs(item.create_time).format("YYYY-MM-DD"),
      };
    });
    const map = new Map();

    // 获取用户头像;
    for (const item of replyList.value) {
      if (!map.get(item.user.id)) {
        const result = await getUserAvatarRequest(item.user.id);
        item.user.avatar = result;
        map.set(item.user.id, result);
      } else {
        item.user.avatar = map.get(item.user.id);
      }
    }
  }

  async function addMomentAction(data: any) {
    const reuslt = await addMomentRequest(data);
    await fetchMomentListAction(data.class_id);
    return reuslt;
  }

  async function removeMomentAction(class_id: number, id: number) {
    const result = await removeMomentRequest(id);
    await fetchMomentListAction(class_id);
    return result;
  }

  async function addReplyAction(data: any) {
    const result = await addReplyRequest(data);
    return result;
  }

  async function removeReplyAction(moment_id: number, id: number) {
    const result = await removeReplyRequest(id);

    await fetchReplyListAction(moment_id);
    return result;
  }

  return {
    momentList,
    replyList,
    fetchMomentListAction,
    fetchReplyListAction,
    addMomentAction,
    removeMomentAction,
    addReplyAction,
    removeReplyAction,
  };
});

export default useDiscussStore;
