import { Maltekst_V0, RichText_V0 } from '../../../types/rich-text/v0';
import { RichText_V1 } from '../../../types/rich-text/v1';
import { RichText_Content_V2 } from '../../../types/rich-text/v2';

export const migrateFromV0ToV1 = (response: RichText_V0): RichText_V1 => ({
  ...response,
  version: 1,
  content: response.content.flatMap((c) => (isMaltekstV0(c) ? c.maltekst : c)),
});

const isMaltekstV0 = (content: RichText_Content_V2 | Maltekst_V0): content is Maltekst_V0 =>
  content.type === 'maltekst' && Object.hasOwn(content, 'source') && Object.hasOwn(content, 'maltekst');
