import type { Connection } from '@hocuspocus/server';

export const sendStateless = (connection: Connection, type: string) => {
  connection.sendStateless(JSON.stringify({ type }));
};
