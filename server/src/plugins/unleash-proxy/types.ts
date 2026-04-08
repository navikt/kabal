import type { FastifyRequest } from 'fastify';
import type { Static } from 'typebox';
import { Type } from 'typebox';
import { isDeployed } from '@/config/env';

export const toggleParams = Type.Object({ toggle: Type.String() });
export const toggleQuerystring = Type.Object({ traceparent: Type.Optional(Type.String()) });

export type ToggleRequest = FastifyRequest<{
  Params: Static<typeof toggleParams>;
  Querystring: Static<typeof toggleQuerystring>;
}>;

export const UNLEASH_PROXY_URL = isDeployed
  ? 'http://klage-unleash-proxy/features'
  : 'https://kabal.intern.dev.nav.no/feature-toggle';
