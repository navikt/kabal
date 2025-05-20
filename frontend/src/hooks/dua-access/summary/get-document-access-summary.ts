import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import type { DocumentAccessEnumMap } from '@app/hooks/dua-access/document-messages';
import { getAccessSummary } from '@app/hooks/dua-access/summary/get-access-summary';
import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';

const ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Følgende handlinger er kun tilgjengelig for tildelt saksbehandler',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Følgende handlinger er kun tilgjengelig for tildelt saksbehandler eller medunderskriver',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Følgende handlinger er kun tilgjengelig for tildelt ROL',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]:
    'Følgende handlinger er kun tilgjengelig for tildelt saksbehandler eller ROL',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Følgende handlinger er ikke tilgjengelig fordi dokumentet er ferdigstilt',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Følgende handlinger er ikke tilgjengelig før dokumentet er returnert av ROL',
  [DocumentAccessEnum.SENT_TO_MU]: 'Følgende handlinger er ikke tilgjengelig når dokumentet er hos medunderskriver',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Følgende handlinger er ikke tilgjengelig når dokumentet er hos ROL',
  [DocumentAccessEnum.ROL_USER]: 'Følgende handlinger er ikke tilgjengelig for ROL',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Følgende handlinger er ikke tilgjengelig for ROL-spørsmål',
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]:
    'Følgende handlinger er ikke tilgjengelig for dokumenter med vedlegg lagt til av ROL',
  [DocumentAccessEnum.CASE_FEILREGISTRERT]:
    'Følgende handlinger er ikke tilgjengelig for dokumenter på feilregistrerte saker',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

const ACCESS_NAMES: Record<keyof DocumentAccess, string> = {
  read: 'Lese dokumentet',
  write: 'Skrive i dokumentet',
  remove: 'Fjerne dokumentet',
  changeType: 'Endre type på dokumentet',
  rename: 'Endre navn på dokumentet',
  finish: 'Ferdigstille dokumentet',
  uploadAttachments: 'Laste opp vedlegg',
  referAttachments: 'Legge til vedlegg fra arkivet',
};

export const getDocumentAccessSummary = (access: DocumentAccess) =>
  getAccessSummary(access, ACCESS_NAMES, ACCESS_ENUM_TO_TEXT);
