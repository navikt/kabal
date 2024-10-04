import { Static, Type } from '@fastify/type-provider-typebox';

export enum DataType {
  BEHANDLING = 'behandling',
  MINE_OPPGAVER = 'mine-oppgaver',
}

export const USER = Type.Object({
  name: Type.String(),
  navIdent: Type.String(),
  roles: Type.Array(Type.String()),
});

export type User = Static<typeof USER>;

export const DOCUMENT = Type.Object({
  id: Type.String(),
  title: Type.String(),
  type: Type.String(),
  templateId: Type.String(),
});

export type Document = Static<typeof DOCUMENT>;

export const BEHANDLING_DATA = Type.Object({
  type: Type.Literal(DataType.BEHANDLING),
  behandlingId: Type.String(),
  medunderskriver: Type.Optional(USER),
  rol: Type.Optional(USER),
  selectedTab: Type.Optional(DOCUMENT),
  smartDocuments: Type.Array(DOCUMENT),
  documents: Type.Array(DOCUMENT),
  utfall: Type.Optional(Type.String()),
  muFlowState: Type.String(),
  rolFlowState: Type.String(),
});

export type BehandlingData = Static<typeof BEHANDLING_DATA>;

export const MINE_OPPGAVER_DATA = Type.Object({
  type: Type.Literal(DataType.MINE_OPPGAVER),
  unfinished: Type.Array(Type.String()),
  finished: Type.Array(Type.String()),
  waiting: Type.Array(Type.String()),
});

export type MineOppgaverData = Static<typeof MINE_OPPGAVER_DATA>;

export const BODY_TYPE = Type.Object({
  url: Type.String(),
  reporter: USER,
  data: Type.Union([BEHANDLING_DATA, MINE_OPPGAVER_DATA]),
});
