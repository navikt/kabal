import { NAIS_CLUSTER_NAME } from '@app/config/config';
import { requiredEnvString } from '@app/config/env-var';
import { generateSpanId, generateTraceId } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { type Static, Type } from 'typebox';
import { Compile } from 'typebox/compile';

const TOKEN_ENDPOINT = requiredEnvString('NAIS_TOKEN_ENDPOINT');

const target = `api://${NAIS_CLUSTER_NAME}.klage.kabal-api/.default`;

const log = getLogger('azure-token');

export const getToken = async (trace_id = generateTraceId()): Promise<TokenResponse> => {
  const span_id = generateSpanId();

  log.debug({ msg: 'Fetching Azure token...', trace_id, span_id });

  const start = performance.now();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identity_provider: 'azuread',
      target,
    }),
  });

  const duration = performance.now() - start;

  if (!res.ok) {
    log.error({ msg: 'Failed to fetch Azure token', data: { status: res.status, duration, trace_id, span_id } });

    throw new Error(`Failed to fetch Azure token: ${res.statusText}`);
  }

  log.debug({
    msg: `Successfully fetched Azure token in ${duration}ms`,
    data: { status: res.status, duration, trace_id, span_id },
  });

  const data = await res.json();

  if (!CHECKER.Check(data)) {
    const errors = [...CHECKER.Errors(data)].join(', ');
    log.error({
      msg: 'Invalid Azure token response',
      data: { status: res.status, duration, errors, trace_id, span_id },
    });

    throw new Error(`Invalid Azure token response: ${errors}`);
  }

  return data;
};

const RESPONSE_TYPE = Type.Object({
  access_token: Type.String(),
  expires_in: Type.Number(),
  token_type: Type.String(),
});

const CHECKER = Compile(RESPONSE_TYPE);

type TokenResponse = Static<typeof RESPONSE_TYPE>;
