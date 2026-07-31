/**
 * /v1/models 响应类型
 */
export interface ModelInfo {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  /** 能力标记 */
  capabilities?: {
    chat: boolean;
    streaming: boolean;
    vision?: boolean;
    embeddings?: boolean;
  };
}

export interface ModelsResponse {
  object: 'list';
  data: ModelInfo[];
}
