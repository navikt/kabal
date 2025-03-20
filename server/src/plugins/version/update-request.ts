import { PROXY_VERSION } from '@app/config/config';
import { getLogger } from '@app/logger';
import type { FastifyRequest } from 'fastify';

const log = getLogger('update-request');

/** Threshold for when client is required to update.
 * @format `YYYY-mm-ddTHH:MM:ss`
 */
const UPDATE_REQUIRED_THRESHOLD: `${string}-${string}-${string}T${string}:${string}:${string}` = '2024-09-19T13:15:00';
const UPDATE_OPTIONAL_THRESHOLD: `${string}-${string}-${string}T${string}:${string}:${string}` = '2025-03-20T11:12:00';

if (UPDATE_REQUIRED_THRESHOLD > PROXY_VERSION) {
  log.error({
    msg: 'Required threshold version is greater than the server version.',
    data: { UPDATE_REQUIRED_THRESHOLD, UPDATE_OPTIONAL_THRESHOLD },
  });
}

if (UPDATE_OPTIONAL_THRESHOLD > PROXY_VERSION) {
  log.error({
    msg: 'Optional threshold version is greater than the server version.',
    data: { UPDATE_REQUIRED_THRESHOLD, UPDATE_OPTIONAL_THRESHOLD },
  });
}

if (UPDATE_REQUIRED_THRESHOLD > PROXY_VERSION || UPDATE_OPTIONAL_THRESHOLD > PROXY_VERSION) {
  process.exit(1);
}

export const getUpdateRequest = (req: FastifyRequest): UpdateRequest => {
  const { client_version, trace_id, span_id } = req;

  // If the client version is not provided, the client must update.
  if (client_version === undefined) {
    log.warn({ msg: 'Client version is not provided', trace_id, span_id });

    return UpdateRequest.REQUIRED;
  }

  // If the client version is less than the threshold version, the client must update.
  if (client_version < UPDATE_REQUIRED_THRESHOLD) {
    return UpdateRequest.REQUIRED;
  }

  if (client_version < UPDATE_OPTIONAL_THRESHOLD) {
    return UpdateRequest.OPTIONAL;
  }

  return UpdateRequest.NONE;
};

enum UpdateRequest {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  NONE = 'NONE',
}
