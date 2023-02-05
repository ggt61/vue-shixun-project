import type { RouteRecordRaw } from "vue-router";
import stroage from "./stroage";

type IRoute = RouteRecordRaw & {
  text?: string;
  icon?: string;
};
// 根据权限获取路由
export function getRoutesByJurisdiction(): IRoute[] {
  const jurisdiction: number = stroage.get("user").id;
  if (jurisdiction === 1) {
    return [
      {
        name: "classInfo",
        text: "班级管理",
        icon: "cluster-o",
        path: "/home/class",
        component: () => import("@/views/home/classInfo/ClassInfoView.vue"),
      },
      {
        name: "student",
        text: "学生管理",
        icon: "friends-o",
        path: "/home/student",
        component: () => import("@/views/home/studentInfo/StudentInfoView.vue"),
      },
      {
        name: "discuss",
        text: "讨论",
        icon: "comment-o",
        path: "/home/discuss",
        component: () => import("@/views/home/discuss/DiscussManager.vue"),
      },
      {
        name: "video",
        text: "视频管理",
        icon: "video-o",
        path: "/home/video",
        component: () => import("@/views/home/video/VideoView.vue"),
      },
      {
        name: "resource",
        text: "资源管理",
        icon: "points",
        path: "/home/resource",
        component: () => import("@/views/home/resource/ResourceView.vue"),
      },
      {
        name: "task",
        text: "任务管理",
        icon: "todo-list-o",
        path: "/home/task",
        component: () => import("@/views/home/taskInfo/TaskInfoView.vue"),
      },
    ];
  }

  return [
    {
      name: "discuss",
      text: "讨论",
      icon: "comment-o",
      path: "/home/discuss",
      component: () => import("@/views/home/discuss/DiscussManagerStudent.vue"),
    },
    {
      name: "video",
      text: "视频管理",
      icon: "video-o",
      path: "/home/video",
      component: () => import("@/views/home/video/VideoStudentView.vue"),
    },
    {
      name: "resource",
      text: "资源管理",
      icon: "points",
      path: "/home/resource",
      component: () => import("@/views/home/resource/ResourceStudentView.vue"),
    },
    {
      name: "task",
      text: "任务管理",
      icon: "todo-list-o",
      path: "/home/task",
      component: () => import("@/views/home/taskInfo/TaskInfoStudentView.vue"),
    },
  ];
}
