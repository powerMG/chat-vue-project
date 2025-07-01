<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="home">智能小助手</el-menu-item>
    <el-sub-menu index="library">
      <template #title>知识库</template>
      <el-menu-item index="mylibrary">我的知识库</el-menu-item>
      <!-- <el-menu-item index="uploadLibirary">上传知识库 </el-menu-item> -->
      <el-sub-menu index="libraryManage">
        <template #title>知识库管理</template>
        <el-menu-item index="workspace">工作空间管理</el-menu-item>
        <el-menu-item index="documents">知识库内容管理</el-menu-item>
        <el-menu-item index="usersManage">用户管理</el-menu-item>
        <el-menu-item index="systemSetting">系统设置</el-menu-item>
        <el-menu-item index="openAI">OpenAI</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">关于我们</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const activeIndex = ref("home");
const handleSelect = (key: string) => {
  router.replace({ name: key });
};
</script>

<style lang="scss" scoped></style>
