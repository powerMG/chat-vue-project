<template>
  <div>
    <h1>聊天界面</h1>
    <div class="chat-box" ref="chatBox">
      <div v-for="(message, index) in messages" :key="index" :class="message.role">
        <div v-if="message.role === 'assistant'">
          <p>{{ message.content }}</p>
          <small v-if="message.thinkTime" class="think-time">思考时间: {{ message.thinkTime }}ms</small>
        </div>
        <p v-else>{{ message.content }}</p>
      </div>
    </div>
    <input v-model="userInput" placeholder="输入消息" />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { callDeepSeekAPI } from '@/apis/chatAPIStream';

const chatBox = ref<HTMLDivElement | null>(null);
const messages = ref<{ role: string; content: string; thinkTime?: number }[]>([
  { role: 'system', content: '你是一个专业的助手' },
]);
const userInput = ref<string>('');

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // 添加用户消息
  messages.value.push({ role: 'user', content: userInput.value });

  try {
    // 调用 DeepSeek API
    const stream = await callDeepSeekAPI(messages.value);

    if (!stream) {
      throw new Error('No stream data received');
    }

    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantContent = ''; // 初始化助手内容
    let thinkStartTime = 0; // 思考开始时间
    let thinkEndTime = 0; // 思考结束时间

    // 读取流式数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      let {
        message: { content },
      } = JSON.parse(chunk);
      assistantContent += content; // 拼接流式数据

      // 处理 <think> 标签
      const thinkRegex = /<think>(.*?)<\/think>/gs;
      let match;
      while ((match = thinkRegex.exec(assistantContent))) {
        const thinkContent = match[1];
        assistantContent = assistantContent.replace(match[0], '');

        if (!thinkStartTime) {
          thinkStartTime = Date.now(); // 记录思考开始时间
        }
        thinkEndTime = Date.now(); // 更新思考结束时间
      }

      // 实时更新助手消息
      const processedContent = assistantContent.replace(/\n/g, '');
      messages.value.push({ role: 'assistant', content: processedContent, thinkTime: thinkEndTime - thinkStartTime });
      // 逐字输出动画
      let currentContent = '';
      const chars = processedContent.split('');
      chars.forEach((char, i) => {
        currentContent += char;
        messages.value[messages.value.length - 1].content = currentContent;
      });
      // 自动滚动到最新内容
      await nextTick();
      chatBox.value?.scrollTo(0, chatBox.value.scrollHeight);
    }
  } catch (error) {
    console.error('API 调用失败:', error);
  } finally {
    userInput.value = ''; // 清空输入框
  }
};

// 自动滚动到最新内容
onMounted(() => {
  chatBox.value?.addEventListener('DOMNodeInserted', () => {
    chatBox.value?.scrollTo(0, chatBox.value.scrollHeight);
  });
});

onUnmounted(() => {
  chatBox.value?.removeEventListener('DOMNodeInserted', () => { });
});
</script>

<style scoped>
.chat-box {
  width: 100%;
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.user {
  color: blue;
}

.assistant {
  color: green;
}

.think-time {
  font-size: 0.8em;
  color: #666;
}
</style>
