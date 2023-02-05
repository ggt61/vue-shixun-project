import axios from "axios";
import { showToast } from "vant";
import type {
  RawAxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosInstance,
} from "axios";
import stroage from "@/utils/stroage";
import router from "@/router";

class NetWorkRequest {
  req: AxiosInstance;
  constructor(config: CreateAxiosDefaults) {
    this.req = axios.create(config);

    // 全局请求拦截器
    this.req.interceptors.request.use(
      (value) => {
        value.headers.authorization = `Bearer ${stroage.get("token")}`;
        return value;
      },
      (err) => {
        console.log(err);
      }
    );
    this.req.interceptors.response.use(
      (value) => {
        if (value.data.code === -2000) {
          showToast({
            message: value.data.message,
            position: "top",
          });
          stroage.clear();
          router.push("/login");
        }
        return value.data;
      },
      (err) => console.log(err)
    );
  }
  async request(config: RawAxiosRequestConfig) {
    return this.req.request(config);
  }
  async get(config: RawAxiosRequestConfig) {
    return this.request({ ...config, method: "GET" });
  }
  async post(config: RawAxiosRequestConfig) {
    return this.request({ ...config, method: "POST" });
  }
  async patch(config: RawAxiosRequestConfig) {
    return this.request({ ...config, method: "PATCH" });
  }
  async delete(config: RawAxiosRequestConfig) {
    return this.request({ ...config, method: "DELETE" });
  }
}

export default new NetWorkRequest({
  baseURL: "/api",
  timeout: 3000,
});
