export const isObject = (data: unknown): data is object => typeof data === 'object' && data !== null;

interface SavedDocumentResponse {
  modified: string;
  version: number;
}

export const isSavedDocumentResponse = (json: unknown): json is SavedDocumentResponse =>
  isObject(json) && 'modified' in json && 'version' in json;
