declare module 'hono' {
  interface ContextVariableMap {
    tabId: string | undefined;
    clientVersion: string | undefined;
    accessToken: string | undefined;
    oboAccessToken: string | undefined;
    traceparent: string;
    traceId: string;
  }
}
