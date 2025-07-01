<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="submitForm"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import axios from "@/axios";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

const loginForm = ref(null);
const loading = ref(false);

const submitForm = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      axios.post("/login", form).then(({ token }) => {
        ElMessage.success("登录成功");
        loading.value = false;
        useAuthStore().login(token);
        router.push("/");
      });
    } else {
      ElMessage.error("表单验证失败");
    }
  });
};
</script>

<style scoped>
/* 全屏背景色 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* 确保宽度铺满全屏 */
  background-color: #f5f7fa; /* 淡色背景 */
  overflow: hidden;
}

/* 登录卡片样式 */
.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* 卡片背景色 */
}

/* 登录表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 登录按钮样式 */
.login-button {
  width: 100%;
}
</style>
