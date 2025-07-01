<template>
  <el-button type="primary" @click="opentDialog">新增知识库</el-button>
  <el-dialog append-to-body title="上传知识库" v-model="dialogFormVisible">
    <el-form :model="libFormInfo" label-width="90px">
      <el-radio-group v-model="activeLibInfo" class="upload-library-plugin-dialog-tool">
        <el-radio value="uploadFile">上传文件</el-radio>
        <el-radio value="uploadLink">上传链接</el-radio>
        <el-radio value="rawText">文本信息</el-radio>
      </el-radio-group>
      <template v-if="activeLibInfo == 'uploadFile'">
        <el-form-item prop="fileRaw" label="上传文件">
          <el-upload :auto-upload="false" :on-change="uploadLibFile" class="inline-btn">
            <template #trigger>
              <el-button type="primary">上传文件到知识库</el-button>
            </template>
          </el-upload>
        </el-form-item>
      </template>
      <template v-if="activeLibInfo == 'uploadLink'">
        <el-form-item prop="fileLink" label="上传链接">
          <el-input v-model="libFormInfo.fileLink"></el-input>
        </el-form-item>
      </template>
      <template v-if="activeLibInfo == 'rawText'">
        <el-form-item prop="rawText" label="文本标题">
          <el-input v-model="libFormInfo.title"></el-input>
        </el-form-item>
        <el-form-item prop="keywords" label="关键词">
          <el-input v-model="libFormInfo.keyWords"></el-input>
        </el-form-item>
        <el-form-item prop="rawText" label="文本内容">
          <el-input type="textarea" v-model="libFormInfo.rawText" :rows="4"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="cancelDocument">取消</el-button>
      <el-button type="primary" @click="saveDocument">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

import { uploadFile, uploadLink, uploadRawText } from "@/apis/anythionChatAPIs.ts";
import { reactive, ref } from "vue";
import type { LibFromInfo } from "./type/uplaodLibrayPlugin";
const emit = defineEmits(["reload"]);
// 知识库表单信息
const libFormInfo = reactive<LibFromInfo>({
  fileRaw: "",
  fileLink: "",
  rawText: "",
  title: "",
  keyWords: "",
});
// 控制知识库弹窗
const dialogFormVisible = ref(false);
// 当前选中的知识库类型
const activeLibInfo = ref("uploadFile");
const opentDialog = () => {
  dialogFormVisible.value = true;
};
// 取消知识库信息录入
const cancelDocument = () => {
  dialogFormVisible.value = false;
};
// 保存知识库信息录入
const saveDocument = async () => {
  let result: any = {
    success: false,
  };
  switch (activeLibInfo.value) {
    case "uploadFile":
      result = await uploadFileByDocument(libFormInfo.fileRaw);
      break;
    case "uploadLink":
      result = await uploadLinkByDocument();
      break;
    case "rawText":
      result = await rawTextByDocument();
      break;
  }
  if (result && result.success) {
    ElMessage.success("保存成功");
    emit("reload");
    cancelDocument();
  } else {
    ElMessage.error("保存失败");
  }
};
// 上传文件并保存
const uploadFileByDocument = async (file: any) => {
  let formData = new FormData();
  formData.append("file", file.raw);
  return await uploadFile(formData);
};
// 保存知识库链接
const uploadLinkByDocument = async () => {
  return await uploadLink({
    link: libFormInfo.fileLink,
  });
};
// 保存知识库文本
const rawTextByDocument = async () => {
  let _params = {
    textContent: libFormInfo.rawText,
    metadata: {
      title: libFormInfo.title,
      keyOne: "",
      keyTwo: "",
      etc: "",
    },
  };
  if (libFormInfo.keyWords) {
    let _arr = libFormInfo.keyWords.split(",");
    if (_arr.length > 1) {
      _params.metadata.keyOne = _arr[0];
      _params.metadata.keyTwo = _arr[1];
    } else if (_arr.length == 1) {
      _params.metadata.keyOne = _arr[0];
    }
  }
  return await uploadRawText(_params);
};
// 上传文件知识库-文件内容选中触发
const uploadLibFile = (uploadFile: any) => {
  console.log(uploadFile, "uploadFile");
  // 记录上传的文件流信息
  libFormInfo.fileRaw = uploadFile;
};
</script>

<style lang="scss" scoped></style>
