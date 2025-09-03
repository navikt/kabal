import { type Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const ACCESS_LIST_TYPE = Type.Object({
  documentId: Type.String(),
  navIdents: Type.Array(Type.String()),
});

export type AccessList = Static<typeof ACCESS_LIST_TYPE>;

export const ACCESS_LIST_CHECKER = TypeCompiler.Compile(ACCESS_LIST_TYPE);

export const ACCESS_LISTS_TYPE = Type.Object({
  smartDocumentWriteAccessList: Type.Array(ACCESS_LIST_TYPE),
});

export type AccessLists = Static<typeof ACCESS_LISTS_TYPE>;

export const ACCESS_LISTS_CHECKER = TypeCompiler.Compile(ACCESS_LISTS_TYPE);

export interface Metadata {
  trace_id: string | undefined;
  span_id: string | undefined;
  tab_id: string | undefined;
  client_version: string | undefined;
  behandling_id?: string;
}
