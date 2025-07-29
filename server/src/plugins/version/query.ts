import { type Static, Type } from '@fastify/type-provider-typebox';

export const QUERY_STRING_SCHEMA = Type.Object({
  version: Type.Optional(Type.String()),
  tabId: Type.Optional(Type.String()),
  traceparent: Type.Optional(Type.String()),
  theme: Type.Optional(Type.Union([Type.Literal('dark'), Type.Literal('light')])),
});

export type QueryStringSchema = Static<typeof QUERY_STRING_SCHEMA>;
