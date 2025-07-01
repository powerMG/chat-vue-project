import axios from "axios";
declare module "axios" {
  interface AnythingResponse<T = any, D = any> {
    localFiles: {
      items: any;
      name: string;
      type: string;
    };
  }
  export interface AxiosResponse<T = any, D = any>
    extends AnythingResponse<T, D> {}
}
const instance = axios.create({
  baseURL: "/anything-server", // 设置基础 URL
  timeout: 5000, // 设置超时时间
});
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加 Token
    config.headers["Authorization"] = `Bearer [token]`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // 处理 401 未授权错误
      console.error("未授权，请重新登录");
    }
    return Promise.reject(error);
  }
);

export default instance;
