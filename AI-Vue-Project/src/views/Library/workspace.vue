<template>
  <el-row class="workspace-main">
    <el-col class="workspace-btn-tool">
      <EditWorkspacePlugin @confirmWorkspace="getWorkspaceList" />
    </el-col>
    <el-col class="workspace-list">
      <el-table border :data="workspaceList" class="workspace-table">
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column prop="name" label="工作空间名称"></el-table-column>
        <el-table-column align="center" label="工作空间线程数">
          <template #default="{ row }">
            <el-popover
              width="200"
              :disabled="!row.threads.length"
              class="box-item"
              title="工作线程"
              placement="right"
            >
              <ul>
                <li v-for="item in row.threads" :key="item.slug">
                  {{ item.name }}
                </li>
              </ul>
              <template #reference>
                <span class="workspace-threads-num">
                  {{ row.threads.length }}
                </span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column prop="lastUpdatedAt" label="最后修改时间"></el-table-column>
        <el-table-column class-name="workspace-edit" label="编辑">
          <template #default="{ row }">
            <EditWorkspacePlugin
              :key="row.slug"
              v-bind="getBindOption(row)"
              @confirmWorkspace="getWorkspaceList"
            />
            <el-link type="primary" class="edit-item" @click="delWorkspace(row)"
              >删除</el-link
            >
            <AddLibraryPlugin :slug="row.slug" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllWorkspaces, delWorkspaceBySlug } from "@/apis/anythionChatAPIs.ts";
import EditWorkspacePlugin from "./components/workspace/editWorkspacePlugin.vue";
import AddLibraryPlugin from "./components/workspace/addLibraryPlugin.vue";
import { ElMessage, ElMessageBox } from "element-plus";
let workspaceList = ref([] as Array<any>);
onMounted(() => {
  getWorkspaceList();
});
/* 获取工作空间列表信息 */
const getWorkspaceList = async () => {
  const res: any = await getAllWorkspaces();
  workspaceList.value = res.workspaces;
};
/* 获取绑定的属性 */
const getBindOption = (row: any) => {
  return {
    bizType: "update",
    title: "修改工作空间",
    btnTitle: "修改",
    btnOptions: {
      btnType: "a",
      bind: {
        className: "edit-item el-link el-link--primary is-underline edit-item",
      },
      onEvent: {
        click: () => {
          return row;
        },
      },
    },
  };
};
/* 删除工作空间 */
const delWorkspace = (row: any) => {
  ElMessageBox.confirm("是否删除该工作空间?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let res: any = await delWorkspaceBySlug(row.slug);
    if (res === "OK") {
      ElMessage.success("删除成功");
      // 移除已经删掉的工作空间
      workspaceList.value = workspaceList.value.filter(
        (item: any) => item.slug !== row.slug
      );
    } else {
      ElMessage.error("删除失败");
    }
  });
};
</script>

<style lang="scss" scoped>
.workspace-main {
  padding: 8px;

  .workspace-btn-tool {
    margin-bottom: 4px;
  }
}

:deep(.workspace-edit) {
  .edit-item {
    margin-right: 4px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
