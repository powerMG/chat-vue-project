import axios from "@/anytingAxios.ts"
//#region Admin
/**
 * /api/v1/admin/is-multi-user-mode
 * 检查实例是否处于多用户模式
 * @returns 
 */
export function isMultiUserMode(){
  return axios.get("/api/v1/admin/is-multi-user-mode")
}
/**
 * /api/v1/admin/users
 * 获取管理用户信息
 * @returns 
 */
export function getAllAdminUsers(){
  return axios.get("/api/v1/admin/users")
}
/**
 * /api/v1/admin/users/new
 * 创建用户信息
 * @param data {"username": "sample-sam","password": "hunter2","role": "default | admin"}
 * @returns 
 */
export function createNewUser(data:any){
  return axios.post("/api/v1/admin/users/new",data)
}
/**
 * /api/v1/admin/users/{id}
 * 根据用户id获取指定用户信息
 * @param id 用户id
 * @returns 
 */
export function getUserById(id:string){
  return axios.post(`/api/v1/admin/users/${id}`)
}
/**
 * /api/v1/admin/users/{id}
 * 根据用户id删除指定用户信息
 * @param id 用户id
 * @returns 
 */
export function delUserById(id:string){
  return axios.delete(`/api/v1/admin/users/${id}`)
}
/**
 * /api/v1/admin/invites
 * 获取所有现有的实例邀请
 * @returns 
 */
export function getAllInvites(){
  return axios.get("/api/v1/admin/invites")
}
/**
 * /api/v1/admin/invite/new
 * 为某人创建一个新的邀请码，用于向实例注册
 * @param data {"workspaceIds": [1,2,45]}
 * @returns 
 */
export function createNewInvite(data:any){
  return axios.post("/api/v1/admin/invite/new",data)
}
/**
 * /api/v1/admin/invite/{id}
 * 按id停用（软删除）邀请
 * @param id 停用的邀请id
 * @returns 
 */
export function delInviteById(id:string){
  return axios.delete(`/api/v1/admin/invite/${id}`)
}
/**
 * /api/v1/admin/workspaces/{workspaceId}/users
 * 检索有权访问指定工作区的用户列表
 * @param workspaceId 工作区id
 * @returns 
 */
export function getWorkspaceUsers(workspaceId:string){
  return axios.get(`/api/v1/admin/workspaces/${workspaceId}/users`)
}
/**
 * /api/v1/admin/workspaces/{workspaceSlug}/manage-users
 * 将工作区权限设置为可由给定的用户ID和管理员访问
 * @param workspaceSlug 数据库中工作区的slug
 * @returns 
 */
export function manageWorkspaceUsers(workspaceSlug:string){
  return axios.post(`/api/v1/admin/workspaces/${workspaceSlug}/manage-users`)
}
/**
 * /api/v1/admin/workspace-chats
 * 系统中的所有聊天记录都是按最近的聊天记录排序的
 * @returns 
 */
export function getAllWorkspaceChats(){
  return axios.post("/api/v1/admin/workspace-chats")
}
/**
 * /api/v1/admin/preferences
 * 更新多用户首选项
 * @returns 
 */
export function getPreferences(){
  return axios.post("/api/v1/admin/preferences")
}
//#endregion

//#region Document
/**
 * /api/v1/document/upload
 * 将新文件上传到AnythingLLM进行解析并准备嵌入
 * @param data 上传的文件流
 * @returns 
 */
export function uploadFile(data:any){
  return axios.post("/api/v1/document/upload",data)
}
/**
 * /api/v1/document/upload-link
 * 上传AnythingLLM的有效URL以进行抓取并准备嵌入。
 * @param data {"link": "https://anythingllm.com"}
 * @returns 
 */
export function uploadLink(data:any){
  return axios.post("/api/v1/document/upload-link",data)
}
/**
 * /api/v1/document/raw-text
 * 通过指定文件的原始文本内容和元数据值来上传文件，而无需上传文件。
 * @param data {
  "textContent": "This is the raw text that will be saved as a document in AnythingLLM.",
  "metadata": {
    "title": "This key is required. See in /server/endpoints/api/document/index.js:287",
    "keyOne": "valueOne",
    "keyTwo": "valueTwo",
    "etc": "etc"
  }
}
 * @returns 
 */
export function uploadRawText(data:any){
  return axios.post("/api/v1/document/raw-text",data)
}
/**
 * /api/v1/documents
 * 实例中所有本地存储文档的列表
 * @returns 
 */
export function getAllDocuments(){
  return axios.get("/api/v1/documents")
}
/**
 * /api/v1/document/accepted-file-types
 * 检查可用的文件类型和可以上传的MIME。
 * @returns 
 */
export function getAcceptedFileTypes(){
  return axios.get("/api/v1/document/accepted-file-types")
}
/**
 * /api/v1/document/metadata-schema
 * 获取进行原始文本上传时的已知可用元数据模式以及每个键的可接受值类型。
 * @param params {
  "schema": {
    "keyOne": "string | number | nullable",
    "keyTwo": "string | number | nullable",
    "specialKey": "number",
    "title": "string"
  }
}
 * @returns 
 */
export function getMetadataSchema(params:any){
  return axios.get("/api/v1/document/metadata-schema",params)
}
/**
 * /api/v1/document/{docName}
 * 通过其唯一的AnythingLLM文档名称获取单个文档
 * @param docName 
 * @returns 
 */
export function getDocumentByName(docName:string){
  return axios.get(`/api/v1/document/${docName}`)
}
/**
 * /api/v1/document/create-folder
 * 在文档存储目录中创建一个新文件夹。
 * @param data {
  "name": "new-folder"
}
 * @returns 
 */
export function createFolder(data:any){
  return axios.post("/api/v1/document/create-folder",data)
}
/**
 * /api/v1/document/move-files
 * 移动文档存储目录中的文件。{
  "files": [
    {
      "from": "custom-documents/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json",
      "to": "folder/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json"
    }
  ]
}
 * @param data 
 * @returns 
 */
export function moveFiles(data:any){
  return axios.post("/api/v1/document/move-files",data)
}

//#endregion

//#region workspace
/**
 * /api/v1/workspace/new
 * 创建一个工作空间
 * @param data {
  "name": "My New Workspace",
  "similarityThreshold": 0.7,
  "openAiTemp": 0.7,
  "openAiHistory": 20,
  "openAiPrompt": "Custom prompt for responses",
  "queryRefusalResponse": "Custom refusal message",
  "chatMode": "chat",
  "topN": 4
}
 * @returns 
 */
export function createNewWorkspace(data:any){
  return axios.post("/api/v1/workspace/new",data)
}
/**
 * /api/v1/workspaces
 * 获取当前所有工作空间
 * @returns 
 */
export function getAllWorkspaces(){
  return axios.get("/api/v1/workspaces")
}

/**
 * /api/v1/workspace/{slug}
 * 通过其独特的slug获得工作空间
 * @param slug 独特的工作空间
 * @returns 
 */
export function getWorkspaceBySlug(slug:string){
  return axios.get(`/api/v1/workspace/${slug}`)
}
/**
 * /api/v1/workspace/{slug}
 * 删除独特的工作空间
 * @param slug 独特的工作空间
 * @returns 
 */
export function delWorkspaceBySlug(slug:string){
  return axios.delete(`/api/v1/workspace/${slug}`)
}
/**
 * /api/v1/workspace/{slug}/update
 * 通过其独特的slug更新工作区设置
 * @param slug 独特的工作空间
 * @param data {
  "name": "Updated Workspace Name",
  "openAiTemp": 0.2,
  "openAiHistory": 20,
  "openAiPrompt": "Respond to all inquires and questions in binary - do not respond in any other format."
}
 * @returns 
 */
export function updateWorkspaceBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/update`,data)
}
/**
 * /api/v1/workspace/{slug}/chats
 * 通过其独特的slug，无论用户如何，都可以获得工作区聊天
 * @param slug 独特的工作空间
 * @returns 
 */
export function getWorkspaceChatsBySlug(slug:string){
  return axios.get(`/api/v1/workspace/${slug}/chats`)
}
/**
 * /api/v1/workspace/{slug}/update-embeddings
 * 通过其唯一的slug在工作区中添加或删除文档。
 * @param slug 
 * @param data {
  "adds": [
    "custom-documents/my-pdf.pdf-hash.json"
  ],
  "deletes": [
    "custom-documents/anythingllm.txt-hash.json"
  ]
}
 * @returns 
 */
export function updateWorkspaceEmbeddingsBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/update-embeddings`,data)
}
/**
 * /api/v1/workspace/{slug}/update-pin
 * 通过其唯一的符号在工作区中的文档中添加或删除引脚。
 * @param slug 
 * @param data {
  "docPath": "custom-documents/my-pdf.pdf-hash.json",
  "pinStatus": true
}
 * @returns 
 */
export function updateWorkspacePinBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/update-pin`,data)
}
/**
 * /api/v1/workspace/{slug}/chat
 * 与工作区执行聊天
 * @param slug 
 * @param data {
  "message": "What is AnythingLLM?",
  "mode": "query | chat",
  "sessionId": "identifier-to-partition-chats-by-external-id",
  "attachments": [
    {
      "name": "image.png",
      "mime": "image/png",
      "contentString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
 * @returns 
 */
export function WorkspaceChatBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/chat`,data)
}
/**
 * /api/v1/workspace/{slug}/stream-chat
 * 与工作区执行流式聊天
 * @param slug 
 * @param data {
  "message": "What is AnythingLLM?",
  "mode": "query | chat",
  "sessionId": "identifier-to-partition-chats-by-external-id",
  "attachments": [
    {
      "name": "image.png",
      "mime": "image/png",
      "contentString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
 * @returns 
 */
export function streamWorkspaceChatBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/stream-chat`,data)
}
/**
 * /api/v1/workspace/{slug}/vector-search
 * 在工作空间中执行向量相似性搜索
 * @param slug 
 * @param data {
  "query": "What is the meaning of life?",
  "topN": 4,
  "scoreThreshold": 0.75
}
 * @returns 
 */
export function vectorSearchWorkspaceChatBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/vector-search`,data)
}
//#endregion

//#region System Setting
/**
 * /api/v1/system/env-dump
 * 将所有设置转储到文件存储
 * @returns 
 */
export function getSystemEnvDump(){
  return axios.get("/api/v1/system/env-dump")
}
/**
 * /api/v1/system
 * 获取已定义的所有当前系统设置
 * @returns 
 */
export function getSystem(){
  return axios.get("/api/v1/system")
}
/**
 * /api/v1/system/vector-count
 * 连通向量数据库中所有向量的数量
 * @returns 
 */
export function getSystemVectorCount(){
  return axios.get("/api/v1/system/vector-count")
}
/**
 * /api/v1/system/update-env
 * 更新系统设置或首选项
 * @param data {
  "VectorDB": "lancedb",
  "AnotherKey": "updatedValue"
}
 * @returns 
 */
export function updateSystemEnv(data:any){
  return axios.post("/api/v1/system/update-env",data)
}
/**
 * /api/v1/system/export-chats
 * 以已知格式从系统中导出所有聊天记录。输出取决于发送的类型。将使用正确的输出标头发送。
 * @param exportType 导出格式jsonl、json、csv、jsonlpara
 * @returns 
 */
export function exportSystemChats(exportType:string){
  return axios.get("/api/v1/system/export-chats",{
    params:{exportType}})
}
/**
 * /api/v1/system/remove-documents
 * 从系统中永久删除文档
 * @param data {
  "names": [
    "custom-documents/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json"
  ]
}
 * @returns 
 */
export function removeSystemDocuments(data:any){
  // return axios.delete("/api/v1/system/remove-documents",data)
  return axios({
    method: 'delete',
    url: '/api/v1/system/remove-documents',
    data
  })
}
//#endregion

//#region Workspace Threads
/**
 * /api/v1/workspace/{slug}/thread/new
 * 创建新的工作区线程
 * @param slug 
 * @param data {
  "userId": 1,
  "name": "Name",
  "slug": "thread-slug"
}
 * @returns 
 */
export function createWorkspaceThreadBySlug(slug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/thread/new`,data)
}
/**
 * /api/v1/workspace/{slug}/thread/{threadSlug}/update
 * 通过其唯一的slug更新线程名称
 * @param slug 
 * @param threadSlug 
 * @param data {
  "name": "Updated Thread Name"
}
 * @returns 
 */
export function updateWorkspaceThreadBySlug(slug:string,threadSlug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/thread/${threadSlug}/update`,data)
}
/**
 * /api/v1/workspace/{slug}/thread/{threadSlug}
 * 删除工作区线程
 * @param slug 
 * @param threadSlug 
 * @returns 
 */
export function removeWorkspaceThreadBySlug(slug:string,threadSlug:string){
  return axios.delete(`/api/v1/workspace/${slug}/thread/${threadSlug}`)
}
/**
 * /api/v1/workspace/{slug}/thread/{threadSlug}/chats
 * 获取工作区线程的聊天记录
 * @param slug 
 * @param threadSlug 
 * @returns 
 */
export function getWorkspaceThreadChatsBySlug(slug:string,threadSlug:string){
  return axios.get(`/api/v1/workspace/${slug}/thread/${threadSlug}/chats`)
}
/**
 * /api/v1/workspace/{slug}/thread/{threadSlug}/chat
 * 与工作区线程聊天
 * @param slug 
 * @param threadSlug 
 * @param data {
  "message": "What is AnythingLLM?",
  "mode": "query | chat",
  "userId": 1,
  "attachments": [
    {
      "name": "image.png",
      "mime": "image/png",
      "contentString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
 * @returns 
 */
export function streamWorkspaceThreadChatBySlug(slug:string,threadSlug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/thread/${threadSlug}/chat`,data)
}
/**
 * /api/v1/workspace/{slug}/thread/{threadSlug}/stream-chat
 * 与工作区线程进行流式聊天
 * @param slug 
 * @param threadSlug 
 * @param data {
  "message": "What is AnythingLLM?",
  "mode": "query | chat",
  "userId": 1,
  "attachments": [
    {
      "name": "image.png",
      "mime": "image/png",
      "contentString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
 * @returns 
 */
export function streamWorkspaceThreadStreamChatBySlug(slug:string,threadSlug:string,data:any){
  return axios.post(`/api/v1/workspace/${slug}/thread/${threadSlug}/stream-chat`,data)
}
//#endregion

//#region User Management
/**
 * /api/v1/users
 * 获取所有用户信息
 * @returns 
 */
export function getAllUsers(){
  return axios.get("/api/v1/users")
}
//#endregion

//#region OpenAI Compatible Endpoints
/**
 * /api/v1/openai/models
 * 获取所有可用的“模型”，这些模型是您可以用于聊天的工作区
 * @returns 
 */
export function getOpenAIModels(){
  return axios.get("/api/v1/openai/models")
}

/**
 * /api/v1/openai/chat/completions
 * 与具有OpenAI兼容性的工作区进行聊天
 * @param data {
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant"
    },
    {
      "role": "user",
      "content": "What is AnythingLLM?"
    },
    {
      "role": "assistant",
      "content": "AnythingLLM is...."
    },
    {
      "role": "user",
      "content": "Follow up question..."
    }
  ],
  "model": "sample-workspace",
  "stream": true,
  "temperature": 0.7
}
 * @returns 
 */
export function getOpenAIChatCompletions(data:any){
  return axios.post("/api/v1/openai/chat/completions",data)
}
/**
 * /api/v1/openai/embeddings
 * 获取任意文本字符串的嵌入
 * @param data{
  "inputs": [
    "This is my first string to embed",
    "This is my second string to embed"
  ],
  "model": null
}
 * @returns 
 */
export function getOpenAIEmbeddings(data:any){
  return axios.post("/api/v1/openai/embeddings",data)
}
/**
 * /api/v1/openai/vector_stores
 * 列出连接到AnythingLLM的所有矢量数据库集合
 * @returns 
 */
export function getOpenAIVectorStores(){
  return axios.get("/api/v1/openai/vector_stores")
}
//#endregion

//#region Embed
/**
 * /api/v1/embed
 * 列出所有活动嵌入
 * @returns 
 */
export function getAllEmbeds(){
  return axios.get("/api/v1/embed")
}

/**
 * /api/v1/embed/{embedUuid}/chats
 * 获取特定嵌入的所有聊天记录
 * @param embedUuid 
 * @returns 
 */
export function getEmbedChatsByUuid(embedUuid:string){
  return axios.get(`/api/v1/embed/${embedUuid}/chats`)
}
/**
 * /api/v1/embed/{embedUuid}/chats/{sessionUuid}
 * 获取特定嵌入和会话的聊天记录
 * @param embedUuid 
 * @param sessionUuid 
 * @returns 
 */
export function getEmbedChatByUuid(embedUuid:string,sessionUuid:string){
  return axios.get(`/api/v1/embed/${embedUuid}/chats/${sessionUuid}`)
}
//#endregion