import { type Static, Type } from 'typebox';
import { Compile } from 'typebox/compile';

export const DOCUMENT_ACCESS_LIST_SCHEMA = Type.Object({
  documentId: Type.String(),
  navIdents: Type.Array(Type.String()),
});

export type DocumentAccessList = Static<typeof DOCUMENT_ACCESS_LIST_SCHEMA>;

export const DOCUMENT_ACCESS_LIST_CHECKER = Compile(DOCUMENT_ACCESS_LIST_SCHEMA);

export interface Metadata {
  tab_id: string | undefined;
  client_version: string | undefined;
  behandling_id?: string;
}
