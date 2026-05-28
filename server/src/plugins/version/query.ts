import { type Static, Type } from '@fastify/type-provider-typebox';

const THEME_SCHEMA = Type.Union([Type.Literal('dark'), Type.Literal('light')]);

const STATUS_SCHEMA = Type.Union([Type.Literal('active'), Type.Literal('idle')]);

export const VERSION_QUERY_STRING_SCHEMA = Type.Object({
  version: Type.Optional(Type.String()),
  tabId: Type.Optional(Type.String()),
  traceparent: Type.Optional(Type.String()),
  theme: Type.Optional(THEME_SCHEMA),
  user_theme: Type.Optional(Type.Union([THEME_SCHEMA, Type.Literal('system')])),
  system_theme: Type.Optional(THEME_SCHEMA),
  status: Type.Optional(STATUS_SCHEMA),
});

export type VersionQueryString = Static<typeof VERSION_QUERY_STRING_SCHEMA>;
