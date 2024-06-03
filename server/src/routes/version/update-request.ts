import { Request } from 'express';
import { VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import { getClientVersion } from '@app/routes/version/get-client-version';

const log = getLogger('update-request');

/** Threshold for when client is required to update.
 * @format `YYYY-mm-ddTHH:MM:ss`
 */
const UPDATE_REQUIRED_THRESHOLD: `${string}-${string}-${string}T${string}:${string}:${string}` = '2024-06-10T13:37:00';
const UPDATE_OPTIONAL_THRESHOLD: `${string}-${string}-${string}T${string}:${string}:${string}` = '2024-06-10T13:37:00';

if (UPDATE_REQUIRED_THRESHOLD > VERSION) {
  log.error({
    msg: 'Required threshold version is greater than the server version.',
    data: { UPDATE_REQUIRED_THRESHOLD, UPDATE_OPTIONAL_THRESHOLD },
  });
}

if (UPDATE_OPTIONAL_THRESHOLD > VERSION) {
  log.error({
    msg: 'Optional threshold version is greater than the server version.',
    data: { UPDATE_REQUIRED_THRESHOLD, UPDATE_OPTIONAL_THRESHOLD },
  });
}

if (UPDATE_REQUIRED_THRESHOLD > VERSION || UPDATE_OPTIONAL_THRESHOLD > VERSION) {
  process.exit(1);
}

export const getUpdateRequest = (req: Request, traceId: string): UpdateRequest => {
  const clientVersion = getClientVersion(req);

  // If the client version is not provided, the client must update.
  if (clientVersion === undefined) {
    log.warn({ msg: 'Client version is not provided', traceId });

    return UpdateRequest.REQUIRED;
  }

  // If the client version is less than the threshold version, the client must update.
  if (clientVersion < UPDATE_REQUIRED_THRESHOLD) {
    return UpdateRequest.REQUIRED;
  }

  if (clientVersion < UPDATE_OPTIONAL_THRESHOLD) {
    return UpdateRequest.OPTIONAL;
  }

  return UpdateRequest.NONE;
};

enum UpdateRequest {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  NONE = 'NONE',
}
