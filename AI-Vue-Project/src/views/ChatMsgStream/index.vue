<template>
  <el-row class="chat-window">
    <el-col :span="2">
      <el-checkbox v-model="searchLibrary" @change="searchLibraryChange"
        >检索知识库</el-checkbox
      >
    </el-col>
    <el-col class="chat-title" :span="20">
      智能小助手<span v-if="isThinking"><i class="el-icon-loading"></i>（思考中……）</span>
    </el-col>
    <template v-if="searchLibrary">
      <el-col :span="24">
        <el-tabs
          v-model="activeSlug"
          type="card"
          class="chat-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="tabItem in tabList"
            :label="tabItem.name"
            :name="tabItem.slug"
            :key="`tab-${tabItem.slug}`"
          />
        </el-tabs>
      </el-col>
      <el-col :span="24">
        <el-tabs v-model="activeThreadSlug" @tab-click="threadHandleClick">
          <el-tab-pane
            v-for="thread in activeInfo.threads"
            :label="thread.name"
            :name="thread.slug"
            :key="thread.slug"
          />
        </el-tabs>
      </el-col>
    </template>
    <el-col class="chat-content" :span="24">
      <template v-for="(message, index) in messages" :key="index">
        <el-collapse v-if="message.role === 'assistant'">
          <el-collapse-item
            :title="`思考信息${
              (message.thinkTime && '-' + message.thinkTime + 's') || ''
            }`"
          >
            {{ message.thinkInfo }}
          </el-collapse-item>
        </el-collapse>
        <div class="chat-message">
          <div
            v-if="message.content"
            class="chat-picture"
            :class="{ 'chat-picture-user': message.role === 'user' }"
          >
            {{ message.role === "user" ? "用户" : "助手" }}
          </div>
          <v-md-preview :text="message.content"></v-md-preview>
        </div>
      </template>
    </el-col>
    <el-col class="chat-input" :span="20">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="4"
        placeholder="请输入消息"
      ></el-input>
    </el-col>
    <el-col class="chat-btn" :span="4">
      <el-button type="primary" plain @click="sendMessage">发送</el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { callDeepSeekAPI } from "@/apis/chatAPIStream";
import {
  getAllWorkspaces,
  getWorkspaceChatsBySlug,
  getWorkspaceThreadChatsBySlug,
} from "@/apis/anythionChatAPIs.ts";
const messages = ref<
  { role: string; content: string; thinkTime?: number; thinkInfo?: string }[]
>([]);
const userInput = ref<string>("");
let thinkStartTime = 0; // 思考开始时间
let thinkEndTime = 0; // 思考结束时间
let isThinking = ref<boolean>(false); // 是否处于思考状态
let searchLibrary = ref<boolean>(false);
let activeSlug = ref("" as string);
let activeInfo = ref({} as any);
let activeThreadSlug = ref("");
let tabList = ref([] as any);
/* 切换tab */
const handleClick = () => {
  activeInfo.value = tabList.value.find((item: any) => item.slug == activeSlug.value);
  if (!activeInfo.value.threads.find((item: any) => item.name === "default")) {
    activeInfo.value.threads.unshift({
      name: "default",
      slug: activeInfo.value.slug,
    });
  }
  activeThreadSlug.value = activeInfo.value.threads[0].slug;
  getChatsMsgBySlug();
};
const threadHandleClick = () => {
  let _currentThread = activeInfo.value.threads.find(
    (item: any) => item.slug == activeThreadSlug.value
  );
  if (_currentThread.name === "default") {
    getChatsMsgBySlug();
  } else {
    getTheadsChartsMsgBySlug();
  }
};
/* 检索知识库 */
const searchLibraryChange = () => {
  if (searchLibrary.value) {
    getAllWrokspaces();
  } else {
    activeSlug.value = "";
  }
};
const _initSetHistoryMessages = (result: any) => {
  let _history = result.history.sort((a: any, b: any) => a.chatId - b.chatId);
  messages.value = _history.map(
    (chartInfo: {
      role: string;
      content: string;
      chatId?: number;
      sentAt?: string;
      thinkInfo: string;
      attachments?: Array<any>;
    }) => {
      let _exp = new RegExp("<think>.*?</think>", "gs");
      let _thinkInfo = chartInfo.content.match(_exp);
      if (_thinkInfo) {
        // 记录思考过程
        chartInfo.thinkInfo = _thinkInfo[0]
          .replace("<think>", "")
          .replace("</think>", "");
      }
      // 处理 <think> 标签
      chartInfo.content = chartInfo.content.replace(_exp, "");
      return chartInfo;
    }
  );
};
/* 获取工作空间的聊天记录 */
const getChatsMsgBySlug = async () => {
  const result: any = await getWorkspaceChatsBySlug(activeThreadSlug.value);
  _initSetHistoryMessages(result);
};
const getTheadsChartsMsgBySlug = async () => {
  const result: any = await getWorkspaceThreadChatsBySlug(
    activeSlug.value,
    activeThreadSlug.value
  );
  _initSetHistoryMessages(result);
};
/* 获取工作空间列表信息 */
const getAllWrokspaces = async () => {
  const result: any = await getAllWorkspaces();
  tabList.value = result.workspaces;
  // 默认选中第一项
  activeSlug.value = tabList.value[0].slug;
  handleClick();
};
const formatDuring = (millisecond: number): number => {
  let seconds: number = (millisecond % (1000 * 60)) / 1000;
  return seconds;
};
const contentFactory = (assistantContent: string) => {
  // 处理 <think> 标签
  if (/<think>(.*?)/gs.test(assistantContent) && !/<\/think>/gs.test(assistantContent)) {
    let _thinkInfo = assistantContent.replace(/<think>/gs, "");
    if (!thinkStartTime) {
      thinkStartTime = Date.now();
    }
    messages.value[messages.value.length - 1].thinkInfo = _thinkInfo;

    isThinking.value = true;
    return;
  } else if (/<\/think>/gs.test(assistantContent)) {
    assistantContent = assistantContent.replace(/<think>(.*?)<\/think>/gs, "");
    isThinking.value = false;
    if (!thinkEndTime) {
      thinkEndTime = Date.now();
    }
    messages.value[messages.value.length - 1].thinkTime = formatDuring(
      thinkEndTime - thinkStartTime
    );
  }
  // 逐字输出动画
  let currentContent = "";
  const chars = assistantContent.split("");
  chars.forEach((char, i) => {
    currentContent += char;
    messages.value[messages.value.length - 1].content = currentContent;
  });
};
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // 添加用户消息
  messages.value.push({ role: "user", content: userInput.value, thinkTime: 0 });

  try {
    let _sendMessage: any = messages.value;
    if (searchLibrary.value && activeSlug.value) {
      // 记录所有用户信息
      let _userMessage = _sendMessage.filter((item: any) => {
        return item.role !== "assistant";
      });
      // 将所有用户信息的最后一个问题点作为进程问答的消息进行发送
      let _message = _userMessage.map((item: any) => item.content)[
        _userMessage.length - 1
      ];
      _sendMessage = {
        message: _message,
        mode: "chat",
        sessionId: "",
        attachments: [],
      };
    }
    // 调用 DeepSeek API
    const stream = await callDeepSeekAPI(
      _sendMessage,
      searchLibrary.value,
      activeSlug.value
    );
    const decoder = new TextDecoder("utf-8");
    let assistantContent = ""; // 初始化助手内容
    const reader = stream.getReader();
    messages.value.push({ role: "assistant", content: "", thinkTime: 0, thinkInfo: "" });
    // 读取流式数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // console.log(value, "value");
      const chunk = decoder.decode(value, { stream: true });
      // console.log(chunk, "chunk");
      let _chunkArr = chunk.split("\n").filter(Boolean);
      _chunkArr.forEach((item: string) => {
        let _content = "";
        if (searchLibrary.value && activeSlug.value) {
          item = item.replace(/^(data):\s?/g, "");
          let { textResponse } = JSON.parse(item);
          _content = textResponse || "";
        } else if (searchLibrary.value) {
          item = item.replace(/^(data):\s?/g, "");
          let { choices } = JSON.parse(item);
          _content = choices[0].delta.content;
        } else {
          let {
            message: { content },
          } = JSON.parse(item);
          _content = content;
        }
        assistantContent += _content; // 拼接流式数据
      });
      // 处理消息
      contentFactory(assistantContent);
    }
    thinkStartTime = 0;
    thinkEndTime = 0;
  } catch (error) {
    console.error("API 调用失败:", error);
  } finally {
    userInput.value = ""; // 清空输入框
  }
};
</script>

<style scoped lang="scss">
.user {
  color: blue;
}

.assistant {
  color: green;
}

.chat-window {
  width: 60%;
  padding: 10px;
  height: 700px;
  margin: 100px auto;
  box-shadow: 0 0 10px #6cb4ffcf;
  overflow: hidden;

  .chat-tabs {
    :deep() {
      .el-tabs__header {
        margin-bottom: 0;
      }
    }
  }

  .chat-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    height: 30px;
  }

  .chat-content {
    overflow-y: auto;
    border: 1px solid #e4e7ed;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    height: 436px;

    .chat-message {
      position: relative;
    }

    .chat-picture {
      width: 35px;
      height: 35px;
      background: #d44512;
      color: #fff;
      overflow: hidden;
      border-radius: 25px;
      font-size: 20px;
      line-height: 35px;
      text-align: center;
      position: absolute;
      top: 12px;
      left: -6px;

      &.chat-picture-user {
        background: #0079ff;
      }
    }
  }

  .chat-input,
  .chat-btn {
    height: 94px;
  }

  .chat-input {
  }

  .chat-btn {
    text-align: center;

    button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
