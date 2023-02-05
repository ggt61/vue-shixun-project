import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { getRoutesByJurisdiction } from "@/utils/getRoutesByJurisdiction";
import stroage from "@/utils/stroage";

const routes: RouteRecordRaw[] = [
  {
    name: "",
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/home/HomeView.vue"),
    children: [
      {
        name: "homeMain",
        path: "/home",
        component: () => import("@/views/home/main/MainView.vue"),
      },
      {
        name: "user",
        path: "/user",
        component: () => import("@/views/user/UserView.vue"),
      },
    ],
  },

  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/LoginView.vue"),
  },
  {
    name: "notFound",
    path: "/:pathMath(.*)*",
    component: () => import("@/views/404/NotFoundView.vue"),
  },
];
// 根据权限注册路由
if (stroage.get("user")) {
  routes[1].children?.push(...getRoutesByJurisdiction());
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.fullPath !== "/login" && !token) {
    return "/login";
  }
});

export default router;
