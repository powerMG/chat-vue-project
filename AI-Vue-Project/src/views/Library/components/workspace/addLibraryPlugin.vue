<template>
  <el-link class="edit-item" type="primary" @click="dialogFormVisible = true"
    >添加知识库</el-link
  >
  <el-dialog
    append-to-body
    title="添加知识库"
    v-model="dialogFormVisible"
    v-if="dialogFormVisible"
  >
    <el-transfer
      v-model="activeDocumentList"
      class="add-libray-plugin-transfer"
      :data="data"
      :titles="['知识库', '工作空间知识库']"
      :button-texts="['删除', '添加']"
    >
      <template #default="{ option }">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="option.label"
          placement="top"
        >
          {{ option.label }}
        </el-tooltip>
      </template>
      <template #left-empty>
        <el-empty :image-size="60" description="暂无数据" />
      </template>
      <template #right-empty>
        <el-empty :image-size="60" description="暂无数据" />
      </template>
    </el-transfer>
    <el-row class="add-libray-plugin-history-group">
      <el-col class="add-libray-plugin-history-title">
        <span>历史已选知识库</span>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="存放添加过且已经被删除的知识库信息"
          placement="top"
        >
          <el-icon :size="20">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col class="add-libray-plugin-history-content">
        <el-tag
          v-if="historyDocumentList.length > 0"
          v-for="tag in historyDocumentList"
          :key="tag.key"
          closable
          effect="dark"
        >
          {{ tag.title }}
        </el-tag>
        <el-empty v-else :image-size="30" description="暂无数据" />
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="saveDocument">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { TransferOption } from "../workspace/type/addLibraryPlugin.d.ts";
import {
  getAllDocuments,
  getWorkspaceBySlug,
  updateWorkspaceEmbeddingsBySlug,
} from "@/apis/anythionChatAPIs.ts";
import { ElMessage } from "element-plus";
const props = defineProps({
  slug: {
    type: String,
    default: "",
  },
});
let data = ref<TransferOption[]>([]);
const dialogFormVisible = ref(false);
const activeDocumentList = ref([]);
const historyDocumentList = ref<TransferOption[]>([]);
let defaultDocumentList = [] as string[];
watch(dialogFormVisible, (val) => {
  if (val) {
    generateData();
  }
});
/* 获取知识库、工作区已选及历史数据 */
const generateData = async () => {
  // 清空重新计算历史信息
  historyDocumentList.value = [];
  // 获取所有文档内容供工作空间选择
  const {
    localFiles: { items: resultLsit },
  }: any = await getAllDocuments();
  let _documentList = [] as TransferOption[];
  resultLsit.forEach((info: any) => {
    _documentList.push(
      info.items.map((item: any) => {
        return {
          key: item.id,
          id: item.id,
          name: item.name,
          title: item.title,
          published: item.published,
          token_count_estimate: item.token_count_estimate,
          type: item.type,
          label: `${item.title}(${info.name})`,
          disabled: false,
          docpath: `${info.name}/${item.name}`,
        };
      })
    );
  });
  data.value = _documentList.flat();
  // 获取当前操作的工作空间已经选有的文档内容
  const res: any = await getWorkspaceBySlug(props.slug);
  const activeList = res.workspace[0].documents.map((item: any) => {
    let _metadata = JSON.parse(item.metadata);
    let _resultItem: TransferOption = {
      key: _metadata.id,
      id: _metadata.id,
      name: item.filename,
      title: _metadata.title,
      published: _metadata.published || "",
      token_count_estimate: _metadata.token_count_estimate,
      type: _metadata.type || "",
      label: `${_metadata.title}`,
      disabled: false,
      docpath: item.docpath,
    };
    // 处理历史知识库信息
    if (!data.value.some((item: any) => item.key === _resultItem.key)) {
      historyDocumentList.value.push(_resultItem);
    }
    return _resultItem;
  });
  activeDocumentList.value = activeList.map((item: any) => item.key);
  // 备份记录当前默认的已选知识库
  defaultDocumentList = activeDocumentList.value;
};
/* 保存知识库 */
const saveDocument = async () => {
  let _params: any = {
    adds: [],
    deletes: [],
  };
  // 排除历史中的数据
  let _currentDocumentList: string[] = activeDocumentList.value.filter(
    (item) => !historyDocumentList.value.find((citem) => citem.key === item)
  );
  if (_currentDocumentList.length > 0) {
    console.log(_currentDocumentList, "新增");
    _currentDocumentList.forEach((item: any) => {
      // 新增项
      if (!defaultDocumentList.includes(item)) {
        // 查询文档信息并标记为新增
        let _documentInfo: TransferOption = data.value.find(
          (citem) => citem.key === item
        ) as TransferOption;
        _params.adds.push(_documentInfo.docpath);
      }
    });
    // 删除项
    defaultDocumentList.forEach((item: string) => {
      if (
        !historyDocumentList.value.find((citem) => citem.key === item) &&
        !_currentDocumentList.includes(item)
      ) {
        // 查询文档信息并标记为删除
        let _documentInfo: TransferOption = data.value.find(
          (citem) => citem.key === item
        ) as TransferOption;
        _params.deletes.push(_documentInfo.docpath);
      }
    });
    console.log(_params, "_params");
  } else {
    // 删除全部
    let _delInfo = data.value.filter((item: any) =>
      defaultDocumentList.includes(item.key)
    );
    _params.deletes = _delInfo.map((item: any) => item.docpath);
  }
  const res: any = await updateWorkspaceEmbeddingsBySlug(props.slug, _params);
  if (res) {
    ElMessage.success("操作成功");
    dialogFormVisible.value = false;
  } else {
    ElMessage.error("操作失败");
  }
};
</script>

<style scoped lang="scss">
.add-libray-plugin-history-group {
  border: solid 1px #dcdfe6;
  margin-top: 8px;
  padding: 0px 8px 8px;
  .add-libray-plugin-history-title {
    border-bottom: 1px solid #dcdfe6;
    font-size: 16px;
    height: 30px;
    align-items: center;
    display: flex;
    overflow: hidden;
    i {
      margin-left: 4px;
    }
  }
  .add-libray-plugin-history-content {
    margin-top: 8px;
    :deep(.el-tag) {
      padding-right: 5px;
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
      margin: 4px;
      position: relative;
      height: 20px;
      line-height: 20px;
      padding-right: 22px;
      .el-tag__close {
        margin-left: 6px;
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.add-libray-plugin-transfer {
  display: flex;
  overflow: hidden;
  :deep(.el-transfer__buttons) {
    width: 200px;
    text-align: center;
    align-self: center;
  }
  :deep(.el-transfer-panel) {
    flex: 1;
  }
}
</style>
