import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import type { AttachmentAccessEnumMap } from '@app/hooks/dua-access/attachment-messages';
import { getAccessSummary } from '@app/hooks/dua-access/summary/get-access-summary';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';

const ACCESS_ENUM_TO_TEXT: AttachmentAccessEnumMap = {
  [AttachmentAccessEnum.ALLOWED]: null,
  [AttachmentAccessEnum.NOT_ASSIGNED]: 'Følgende handlinger er kun tilgjengelig for tildelt saksbehandler',
  [AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Følgende handlinger er kun tilgjengelig for tildelt saksbehandler eller medunderskriver',
  [AttachmentAccessEnum.FINISHED]: 'Følgende handlinger er ikke tilgjengelig fordi dokumentet er ferdigstilt',
  [AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER]:
    'Følgende handlinger er ikke tilgjengelig når dokumentet er hos medunderskriver',
  [AttachmentAccessEnum.SENT_TO_ROL]: 'Følgende handlinger er ikke tilgjengelig når dokumentet er hos ROL',
  [AttachmentAccessEnum.NOT_SENT_TO_ROL]:
    'Følgende handlinger er ikke tilgjengelig når dokumentet er hos saksbehandler',
  [AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT]:
    'Følgende handlinger er ikke tilgjengelig for vedlegg lagt til av saksbehandler',
  [AttachmentAccessEnum.ROL_OWNED_ATTACHMENT]: 'Følgende handlinger er ikke tilgjengelig for vedlegg lagt til av ROL',
  [AttachmentAccessEnum.FEILREGISTRERT]:
    'Følgende handlinger er ikke tilgjengelig for vedlegg på feilregistrerte saker',
  [AttachmentAccessEnum.NOT_SUPPORTED]: null,
};

const ACCESS_NAMES: Record<keyof AttachmentAccess, string> = {
  read: 'Lese vedlegget',
  write: 'Skrive i vedlegget',
  remove: 'Fjerne vedlegget',
  rename: 'Endre navn på vedlegget',
  move: 'Flytte vedlegget',
};

export const getAttachmentAccessSummary = (access: AttachmentAccess) =>
  getAccessSummary(access, ACCESS_NAMES, ACCESS_ENUM_TO_TEXT);
