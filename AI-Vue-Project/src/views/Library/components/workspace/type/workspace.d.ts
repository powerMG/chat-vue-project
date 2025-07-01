export interface WorkspaceForm {
  name: string;
  similarityThreshold: number;
  openAiTemp: number;
  openAiHistory: number;
  openAiPrompt: string;
  queryRefusalResponse: string;
  chatMode: string;
  topN: number;
}
