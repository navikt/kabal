import { getLogger } from '@app/logger';
import { ValkeyExtension } from '@app/plugins/crdt/valkey-extension';
import { getValkeyConfig } from '@app/valkey/valkey-client';

const log = getLogger('collaboration');

export const getValkeyExtension = () => {
  const config = getValkeyConfig();

  if (config === null) {
    log.error({ msg: 'No collaboration Valkey connection configured' });
    process.exit(1);
  }

  log.info({ msg: 'Collaboration Valkey connection configured' });

  return new ValkeyExtension(config);
};
