<template>
  <div class="document-main">
    <div class="document-content-group">
      <el-row class="document-content">
        <el-col class="document-content-btn">
          <uploadLibraryPlugin @reload="getDocumentList" />
          <el-button plain @click="deleteDocument">删除</el-button>
        </el-col>
        <el-col class="document-content-table">
          <el-table
            border
            :data="documentTableList"
            height="100%"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="80"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="title"
              label="文件名称"
              show-overflow-tooltip
              min-width="200"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="url"
              label="文件路径"
              min-width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="description"
              show-overflow-tooltip
              label="文件描述"
              min-width="200"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="docAuthor"
              show-overflow-tooltip
              label="文件作者"
              min-width="100"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="docSource"
              show-overflow-tooltip
              label="文件来源"
              min-width="120"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="published"
              show-overflow-tooltip
              label="发布时间"
              min-width="120"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import uploadLibraryPlugin from "@/views/Library/components/document/uploadLibraryPlugin.vue";
import { getAllDocuments, removeSystemDocuments } from "@/apis/anythionChatAPIs";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
let documentTableList = ref<any>([]);
const selectionList = ref([]);
onMounted(() => {
  // 初始化获取所有工作空间信息
  // getWorkspaceList();
  getDocumentList();
});
// 删除文档内容
const deleteDocument = () => {
  if (selectionList.value.length < 1) {
    ElMessage.warning("请至少选择一条数据");
    return;
  }
  ElMessageBox.confirm("确定要删除选中项吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let _deleteNames = selectionList.value.map((item: any) => {
      return `${item.docName}/${item.name}`;
    });
    removeSystemDocuments({ names: _deleteNames })
      .then(() => {
        ElMessage.success("删除成功");
        getDocumentList();
      })
      .catch(() => {
        ElMessage.error("删除失败");
      });
  });
};
// 列表复选框选中触发
const selectionChange = (selection: any) => {
  selectionList.value = selection;
};
const getDocumentList = async () => {
  const res: any = await getAllDocuments();
  documentTableList.value = [];
  res.localFiles.items.forEach((documentInfo: any) => {
    let _currentDocumentList = documentInfo.items.map((item: any) => {
      item.docName = documentInfo.name;
      item.type = documentInfo.type;
      return item;
    });
    documentTableList.value = documentTableList.value.concat(_currentDocumentList);
  });
};
</script>

<style scoped lang="scss">
.document-main {
  display: flex;
  overflow: hidden;
  height: 100%;

  .document-tab-group {
    width: 300px;
  }

  .document-content-group {
    flex: 1;
    padding: 8px;
    overflow: hidden;

    .document-content {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .document-content-btn {
        margin-bottom: 4px;
      }

      .document-content-table {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
