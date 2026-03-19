import { getLogger } from '@/logger';
import { ValkeyExtension } from '@/plugins/crdt/valkey-extension';
import { getValkeyConfig } from '@/valkey/valkey-client';

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
