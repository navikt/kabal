import { type Static, Type } from '@fastify/type-provider-typebox';
import { Value } from 'typebox/value';

/**
 * Required, so the same content always has the same key. Archived documents always have explicit variants,
 * and the viewer always sends the displayed variant's format.
 */
const FORMAT = Type.Union([Type.Literal('ARKIV'), Type.Literal('SLADDET'), Type.Literal('FULLVERSJON')]);

/** Only archived documents can be highlighted. Documents in progress change, and get new IDs when archived. */
export const HIGHLIGHTS_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  documentId: Type.String({ pattern: '^\\d{1,20}$', description: 'Archived dokumentInfoId' }),
});
export const HIGHLIGHTS_QUERYSTRING = Type.Object({ format: FORMAT });
export const HIGHLIGHT_EVENTS_PARAMS = Type.Pick(HIGHLIGHTS_PARAMS, ['behandlingId']);

/** Each highlight is validated by `applyHighlightChanges`. Only the body limit bounds the request size. */
export const HIGHLIGHT_CHANGES_BODY = Type.Object({
  added: Type.Array(Type.Unknown()),
  removedIds: Type.Array(Type.String({ maxLength: 64 })),
});

/** Larger requests get `413`, which the viewer shows as a permanent error. */
export const HIGHLIGHT_CHANGES_BODY_LIMIT = 2 * 1024 * 1024; // 2 MB

/** One user's highlights in one behandling. */
export interface HighlightBehandling extends Static<typeof HIGHLIGHT_EVENTS_PARAMS> {
  navIdent: string;
}

/** One user's highlights in one document variant, in one behandling. */
export interface HighlightDocument extends HighlightBehandling, Static<typeof HIGHLIGHTS_PARAMS> {
  format: HighlightFormat;
}

export type HighlightFormat = Static<typeof FORMAT>;

export const isHighlightFormat = (value: string): value is HighlightFormat => Value.Check(FORMAT, value);
