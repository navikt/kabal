export interface OboCacheTierInterface {
  get(key: string): Promise<{ token: string; expiresAt: number } | null>;
  set(key: string, token: string, expiresAt: number): Promise<void>;
}

export interface OboCacheInterface {
  get(key: string): Promise<string | null>;
  set(key: string, token: string, expiresAt: number): Promise<void>;
}
