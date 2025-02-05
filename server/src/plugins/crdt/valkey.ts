import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import { ValkeyExtension } from '@app/plugins/crdt/valkey-extension/valkey-extension';

const log = getLogger('collaboration');

const VALKEY_URI = optionalEnvString('VALKEY_URI_HOCUSPOCUS');
const VALKEY_USERNAME = optionalEnvString('VALKEY_USERNAME_HOCUSPOCUS');
const VALKEY_PASSWORD = optionalEnvString('VALKEY_PASSWORD_HOCUSPOCUS');

export const getValkeyExtension = () => {
  const hasValkey = VALKEY_URI !== undefined && VALKEY_USERNAME !== undefined && VALKEY_PASSWORD !== undefined;

  if (!hasValkey) {
    log.error({ msg: 'No collaboration Valkey connection configured' });
    process.exit(1);
  }

  log.info({ msg: 'Collaboration Valkey connection configured' });

  return new ValkeyExtension({
    url: VALKEY_URI,
    username: VALKEY_USERNAME,
    password: VALKEY_PASSWORD,
  });
};
