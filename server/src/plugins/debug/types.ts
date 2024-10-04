import { type Static, Type } from '@fastify/type-provider-typebox';

export enum DataType {
  BEHANDLING = 'behandling',
}

export const USER = Type.Object({
  name: Type.String(),
  navIdent: Type.String(),
});

export type User = Static<typeof USER>;

export const DOCUMENT = Type.Object({
  id: Type.String(),
  title: Type.String(),
  type: Type.String(),
  templateId: Type.Union([Type.String(), Type.Null()]),
});

export type Document = Static<typeof DOCUMENT>;

export const BEHANDLING_DATA = Type.Object({
  type: Type.Literal(DataType.BEHANDLING),
  behandlingId: Type.String(),
  medunderskriver: Type.Union([USER, Type.Null()]),
  rol: Type.Union([USER, Type.Null()]),
  selectedTab: Type.Union([Type.String(), Type.Null()]),
  smartDocuments: Type.Array(DOCUMENT),
  documents: Type.Array(DOCUMENT),
  utfall: Type.Union([Type.String(), Type.Null()]),
  ekstraUtfall: Type.Array(Type.String()),
  muFlowState: Type.String(),
  rolFlowState: Type.String(),
});

export type BehandlingData = Static<typeof BEHANDLING_DATA>;

const ENHET = Type.Object({
  id: Type.String(),
  navn: Type.String(),
  lovligeYtelser: Type.Array(Type.String()),
});

export const REPORTER = Type.Object({
  navIdent: Type.String(),
  navn: Type.String(),
  roller: Type.Array(Type.String()),
  enheter: Type.Array(ENHET),
  ansattEnhet: ENHET,
  tildelteYtelser: Type.Array(Type.String()),
});

export type Reporter = Static<typeof REPORTER>;

export const BODY_TYPE = Type.Object({
  url: Type.String(),
  reporter: REPORTER,
  version: Type.String(),
  data: Type.Optional(Type.Union([BEHANDLING_DATA, Type.Null()])),
});
