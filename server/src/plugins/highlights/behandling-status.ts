import { Type } from '@fastify/type-provider-typebox';
import type { FastifyRequest } from 'fastify';
import { Value } from 'typebox/value';
import { ApiClientEnum } from '@/config/config';
import { getProxyRequestHeaders } from '@/helpers/prepare-request-headers';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { KABAL_API_URL } from '@/plugins/crdt/api/url';

const log = getLogger('highlights-behandling-status');

export enum BehandlingStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
  /** The user has no access to the behandling. */
  FORBIDDEN = 'forbidden',
  UNKNOWN = 'unknown',
}

const BEHANDLING_STATUS_SCHEMA = Type.Object({ active: Type.Boolean() });

/** Whether the behandling is active, read from Kabal API with the user's token. `unknown` if it can't be read. */
export const getBehandlingStatus = async (req: FastifyRequest, behandlingId: string): Promise<BehandlingStatus> =>
  withSpan('highlights.get_behandling_status', { behandling_id: behandlingId }, async (span) => {
    try {
      const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API);

      const headers: Record<string, string> = {
        ...getProxyRequestHeaders(req, ApiClientEnum.KABAL_API, oboAccessToken),
        accept: 'application/json', // The browser's `accept: text/event-stream` would make Kabal API respond with 406.
      };

      const response = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/active`, { headers });

      span.setAttribute('http.status_code', response.status);

      if (response.status === 403) {
        return BehandlingStatus.FORBIDDEN;
      }

      if (!response.ok) {
        log.warn({ msg: 'Failed to fetch behandling status', data: { status: response.status, behandlingId } });

        return BehandlingStatus.UNKNOWN;
      }

      const json: unknown = await response.json();

      if (!Value.Check(BEHANDLING_STATUS_SCHEMA, json)) {
        log.warn({ msg: 'Invalid behandling status response', data: { behandlingId } });

        return BehandlingStatus.UNKNOWN;
      }

      return json.active ? BehandlingStatus.ACTIVE : BehandlingStatus.FINISHED;
    } catch (error) {
      log.warn({ msg: 'Error fetching behandling status', error, data: { behandlingId } });

      return BehandlingStatus.UNKNOWN;
    }
  });
