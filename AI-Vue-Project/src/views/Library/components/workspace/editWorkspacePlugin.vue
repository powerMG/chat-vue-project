<template>
  <component :is="btnOptions.btnType" v-bind="btnOptions.bind" v-on="btnOptions.onEvent">
    {{ props.btnTitle }}
  </component>
  <el-dialog
    append-to-body
    v-if="dialogFormVisible"
    v-model="dialogFormVisible"
    :title="props.title"
  >
    <el-form :data="workspaceForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="name" label="工作空间名称">
            <el-input v-model="workspaceForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="similarityThreshold">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="相似性阈值通常用于衡量两个文本之间的相似度，常用于文本检索、抄袭检测等场景。OpenAI的模型可以通过计算文本嵌入向量之间的相似度来判断文本之间的相似性。相似性阈值是一个数值，用于决定两个文本是否足够相似。"
                placement="top"
              >
                <el-icon :size="20">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              相似性阈值
            </template>
            <el-input-number
              v-model="workspaceForm.similarityThreshold"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="openAiTemp">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="温度是一个控制模型输出随机性和创造性的参数。它决定了模型在生成文本时的概率分布的“尖锐度”或“平滑度”。取值范围：通常在0到2之间"
                placement="top"
              >
                <el-icon :size="20">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              温度
            </template>
            <el-input-number
              v-model="workspaceForm.openAiTemp"
              :max="2"
              :min="0"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="openAiHistory">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="历史通常指的是模型在生成文本时考虑的上下文信息。在对话场景中，历史信息可以帮助模型生成更连贯和相关的回答。"
                placement="top"
              >
                <el-icon :size="20">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              历史
            </template>
            <el-input-number
              v-model="workspaceForm.openAiHistory"
              :min="0"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="topN">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="常用于控制生成文本时的候选词数量."
                placement="top"
              >
                <el-icon :size="20">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              概率阈值
            </template>
            <el-input-number
              :min="0"
              v-model="workspaceForm.topN"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="chatMode" label="模型">
            <el-input disabled v-model="workspaceForm.chatMode"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="openAiPrompt" label="成功后响应内容">
            <el-input
              v-model="workspaceForm.openAiPrompt"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="queryRefusalResponse" label="失败后响应内容">
            <el-input
              v-model="workspaceForm.queryRefusalResponse"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="cancelWorkspace">取消</el-button>
      <el-button type="primary" @click="confirmWorkspace">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  createNewWorkspace,
  getWorkspaceBySlug,
  updateWorkspaceBySlug,
} from "@/apis/anythionChatAPIs.ts";
import type { WorkspaceForm } from "../workspace/type/workspace.ts";
import { ElMessage } from "element-plus";

const emit = defineEmits(["confirmWorkspace", "cancelWorkspace"]);
const props = defineProps({
  bizType: {
    type: String,
    defalut: (rawProps: any) => {
      if (["add", "update"].includes(rawProps.bizType)) {
        return rawProps.bizType;
      } else {
        return "add";
      }
    },
  },
  title: {
    type: String,
    default: "新增工作空间",
  },
  btnTitle: {
    type: String,
    default: "新增工作空间",
  },
  btnOptions: {
    type: Object,
    default: () => ({
      btnType: "el-button",
      bind: {
        type: "primary",
      },
      onEvent: {
        click: () => {},
      },
    }),
  },
});
let dialogFormVisible = ref(false);
let workspaceForm = reactive({
  name: "",
  similarityThreshold: 0,
  openAiTemp: 0,
  openAiHistory: 0,
  openAiPrompt: "",
  queryRefusalResponse: "",
  chatMode: "chat",
  topN: 0,
} as WorkspaceForm);
let editSlug = ref("");
let btnOptions = reactive(props.btnOptions);
Object.keys(btnOptions.onEvent).forEach((fun) => {
  let _funResult = null;
  if (typeof props.btnOptions.onEvent[fun] === "function") {
    _funResult = props.btnOptions.onEvent[fun]();
  }
  btnOptions.onEvent[fun] = () => {
    if (_funResult && props.bizType === "update") {
      // 获取指定的工作空间信息
      getWorkspaceBySlug(_funResult.slug).then((res: any) => {
        if (res.workspace && res.workspace.length > 0) {
          editSlug.value = _funResult.slug;
          workspaceForm = reactive(res.workspace[0]);
          // 修改
          dialogFormVisible.value = true;
        }
      });
    } else {
      // 新增
      dialogFormVisible.value = true;
    }
  };
});
/* 点击确定触发 */
const confirmWorkspace = async () => {
  if (props.bizType === "update") {
    // 确定修改
    updateWorkspace();
  } else {
    // 确定新增
    addWorkspace();
  }
};
/* 修改工作空间 */
const updateWorkspace = async () => {
  const res: any = await updateWorkspaceBySlug(editSlug.value, workspaceForm);
  if (res && res.workspace) {
    ElMessage.success("修改成功");
    dialogFormVisible.value = false;
    emit("confirmWorkspace", workspaceForm);
  } else {
    ElMessage.error("修改失败");
  }
};
/* 添加工作空间 */
const addWorkspace = async () => {
  const res: any = await createNewWorkspace(workspaceForm);
  if (res) {
    ElMessage.success("保存成功");
    dialogFormVisible.value = false;
    emit("confirmWorkspace", workspaceForm);
  } else {
    ElMessage.error("保存失败");
  }
};
/* 取消工作空间 */
const cancelWorkspace = () => {
  dialogFormVisible.value = false;
  emit("cancelWorkspace");
};
</script>

<style scoped lang="scss">
:deep() {
  .el-form-item {
    .el-form-item__label {
      align-items: center;

      i {
        margin-right: 4px;
        cursor: pointer;
      }
    }

    .el-form-item__content {
      .el-input,
      .el-input-number {
        width: 100%;
      }
    }
  }
}
</style>
