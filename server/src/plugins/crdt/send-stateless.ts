import { getLogger } from '@app/logger';
import type { Connection } from '@hocuspocus/server';

const OLD_VERSION = '2026-02-25T09:43:48';

const log = getLogger('send-stateless');

export const sendStateless = (
  connection: Connection,
  client_version: string | undefined,
  type: string,
  metadata: { trace_id: string | undefined; span_id: string | undefined; tab_id: string | undefined },
) => {
  if (client_version === undefined) {
    log.error({ msg: 'Client version is undefined', ...metadata, data: { type } });

    return;
  }

  if (client_version <= OLD_VERSION) {
    connection.sendStateless(type);

    return;
  }

  connection.sendStateless(JSON.stringify({ type, ...metadata }));
};
