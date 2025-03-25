import { getShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';

export const getHasVisibleVedlegg = ({ vedlegg, journalpostId }: IArkivertDocument) =>
  vedlegg.length > 0 && getShowVedlegg().includes(journalpostId);
