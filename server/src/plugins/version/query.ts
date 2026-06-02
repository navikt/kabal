import { type Static, Type } from '@fastify/type-provider-typebox';

export const VERSION_QUERY_STRING_SCHEMA = Type.Object({
  version: Type.Optional(Type.String()),
  tabId: Type.Optional(Type.String()),
  traceparent: Type.Optional(Type.String()),
  theme: Type.Union([Type.Literal('dark'), Type.Literal('light')], { default: 'light' }),
  user_theme: Type.Union([Type.Literal('dark'), Type.Literal('light'), Type.Literal('system')], { default: 'system' }),
  system_theme: Type.Union([Type.Literal('dark'), Type.Literal('light')], { default: 'light' }),
  status: Type.Union([Type.Literal('active'), Type.Literal('idle')], { default: 'active' }),
  app: Type.Union([Type.Literal('kabal'), Type.Literal('file-viewer')], { default: 'kabal' }),
});

export type VersionQueryString = Static<typeof VERSION_QUERY_STRING_SCHEMA>;
