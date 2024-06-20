declare module 'fastify' {
  export interface FastifyRequest {
    tabId: string;
    clientVersion: string;
    traceparent: string;
    traceId: string;
  }
}
