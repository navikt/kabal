import type { Connection } from '@hocuspocus/server';

export const sendStateless = (
  connection: Connection,
  type: string,
  metadata: { trace_id: string | undefined; span_id: string | undefined; tab_id: string | undefined },
) => {
  connection.sendStateless(JSON.stringify({ type, ...metadata }));
};
