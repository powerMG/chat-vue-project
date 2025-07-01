<template>
   <div>
    <h1>聊天界面</h1>
    <div v-for="(message, index) in messages" :key="index">
      <p :class="message.role">{{ message.content }}</p>
    </div>
    <input v-model="userInput" placeholder="输入消息" />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { callDeepSeekAPI } from '@/apis/chatAPI';

const messages = ref<{ role: string; content: string }[]>([
  { role: 'system', content: '你是一个专业的助手' },
]);
const userInput = ref<string>('');

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // 添加用户消息
  messages.value.push({ role: 'user', content: userInput.value });

  try {
    // 调用 DeepSeek API
    const response = await callDeepSeekAPI(messages.value);

    // 处理返回的数据
    let assistantContent = '';
    if (typeof response === 'string') {
      // 如果返回的是字符串，直接处理
      assistantContent = response;
    } else if (response && response.message) {
      // 如果返回的是 JSON，提取 message 内容
      assistantContent = response.message.content;
    } else {
      console.warn('未知的响应格式:', response);
    }

    // 处理 <think> 标签
    assistantContent = assistantContent.replace(/<think>.*?<\/think>/g, '');

    // 实时更新助手消息
    messages.value.push({ role: 'assistant', content: assistantContent });
  } catch (error) {
    console.error('API 调用失败:', error);
  } finally {
    userInput.value = ''; // 清空输入框
  }
};
</script>

<style scoped>
.user {
  color: blue;
}
.assistant {
  color: green;
}
</style>