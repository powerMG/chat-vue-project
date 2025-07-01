export const callDeepSeekAPI = async (messages: any[]): Promise<any> => {
  const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || '/deepseek-server';
  const endpoint = '/api/chat';

  const data = {
    model: 'deepseek-r1:32b',
    messages,
    stream: false, // 设置为 false，表示不使用流式响应
  };

  const response = await fetch(DEEPSEEK_API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json(); // 解析返回的 JSON 数据
};


