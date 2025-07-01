const deepseekChat = async (messages: any, url: string) => {
  const data = {
    model: "deepseek-r1:32b",
    messages,
    stream: true, // 启用流式响应
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body as ReadableStream; // 返回流式数据
};
const anythingChat = async (messages: any, url: string, slug?: string) => {
  const data = slug
    ? messages
    : {
        model: "[模型id]",
        stream: true,
        temperature: 0.7,
        messages,
      };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer [API密钥]`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body as ReadableStream; // 返回流式数据
};
export const callDeepSeekAPI = async (
  messages: any[],
  searchLibrary: boolean,
  slug?: string
): Promise<ReadableStream> => {
  let url = "/deepseek-server/api/chat";
  if (searchLibrary) {
    // 查询知识库
    if (slug) {
      // 进程中查询
      url = `/anything-server/api/v1/workspace/${slug}/stream-chat`;
    } else {
      // 默认查询
      url = "/anything-server/api/v1/openai/chat/completions";
    }
  }
  return searchLibrary
    ? anythingChat(messages, url, slug)
    : deepseekChat(messages, url);
};
