<template>
  <el-row class="my-library-main">
    <el-col :span="24">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="tabItem in tabList"
          :label="tabItem.name"
          :name="tabItem.slug"
          :key="tabItem.slug"
        />
      </el-tabs>
    </el-col>
    <el-col :span="24">
      <!-- <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="uploadLibFile"
        class="inline-btn"
      >
        <template #trigger>
          <el-button type="primary">上传文件到知识库</el-button>
        </template>
      </el-upload>
      <el-button class="inline-btn" @click="dialogFormVisible = true"
        >上传链接到知识库</el-button
      > -->
      <!-- <el-button class="inline-btn" @click="getLibrary">刷新知识库</el-button> -->
    </el-col>
    <el-col :span="24">
      <el-table border :data="tableData">
        <el-table-column align="center" type="index" width="80" label="序号" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="filename" label="文件名称" />
        <el-table-column prop="docpath" label="URL" />
        <el-table-column prop="published" label="发布时间" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="lastUpdatedAt" label="创建时间" />
      </el-table>
    </el-col>
  </el-row>
  <el-dialog title="添加知识库" v-model="dialogFormVisible" width="400">
    <el-form>
      <el-form-item>
        <el-input v-model="libraryForm.link"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelLibraryLink">取消</el-button>
      <el-button type="primary" @click="confirmLibraryLink">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import {
  getAllDocuments,
  uploadFile,
  uploadLink,
  getAllEmbeds,
  getAllWorkspaces,
  getWorkspaceBySlug,
} from "@/apis/anythionChatAPIs.ts";
let tableData = ref([]);
let libraryForm = ref({ link: "" });
let dialogFormVisible = ref(false);
let activeName = ref("");
let tabList = ref([] as any);
onMounted(() => {
  // 初始化获取知识库信息
  getLibrary();
  // 初始化获取所有工作空间信息
  getWorkspaceList();
});
/* 切换tab */
const handleClick = () => {
  getWorkspaceLibraryBySlug();
};
/* 获取指定会话中的知识库 */
const getWorkspaceLibraryBySlug = async () => {
  let result: any = await getWorkspaceBySlug(activeName.value);
  tableData.value =
    (result.workspace &&
      result.workspace.length > 0 &&
      result.workspace[0].documents.map((item: any) => {
        let _matData = JSON.parse(item.metadata);
        return {
          ...item,
          ..._matData,
        };
      })) ||
    [];
};
/* 获取工作空间列表信息 */
const getWorkspaceList = async () => {
  const result: any = await getAllWorkspaces();
  tabList.value = result.workspaces;
  // 默认选中第一项
  activeName.value = tabList.value[0].slug;
  getWorkspaceLibraryBySlug();
};
/* 获取知识库 */
const getLibrary = async () => {
  const result: any = await getAllDocuments();
  tableData.value = result.localFiles.items[0].items;
};

/* 上传文件到知识库 */
const uploadLibFile = async (file: any) => {
  console.log(file, "file");
  const formData = new FormData();
  formData.append("file", file.raw);
  const result: any = await uploadFile(formData);
  if (result.success) {
    ElMessage.success("上传成功");
    getLibrary();
  } else {
    ElMessage.error("上传失败");
  }
};
/* 取消知识库链接 */
const cancelLibraryLink = () => {
  dialogFormVisible.value = false;
};
/* 确认知识库链接 */
const confirmLibraryLink = async () => {
  if (libraryForm.value.link == "") {
    return ElMessage.warning("请输入链接");
  }
  const result: any = await uploadLink(libraryForm.value);
  if (result.success) {
    ElMessage.success("上传成功");
    dialogFormVisible.value = false;
    getLibrary();
  } else {
    ElMessage.error("上传失败");
  }
};
/* 获取所有待嵌入内容 */
const getAllLibraryEmbeds = async () => {
  const result: any = await getAllEmbeds();
  console.log(result, "待嵌入内容");
};
</script>

<style scoped lang="scss">
.my-library-main {
  padding: 10px;
}

.inline-btn {
  display: inline-block;
  margin-right: 4px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
