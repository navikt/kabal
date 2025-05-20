import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';

export type AttachmentAccessEnumMap = Record<AttachmentAccessEnum, string | null>;

export const WRITE_ACCESS_ENUM_TO_TEXT: AttachmentAccessEnumMap = {
  [AttachmentAccessEnum.ALLOWED]: null,
  [AttachmentAccessEnum.NOT_ASSIGNED]: 'Vedlegget kan kun skrives i av tildelt saksbehandler.',
  [AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Vedlegget kan kun skrives i av tildelt saksbehandler eller tilsendt medunderskriver.',
  [AttachmentAccessEnum.FINISHED]: 'Vedlegget kan ikke skrives i fordi saken er ferdigstilt.',
  [AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER]: 'Vedlegget kan kun skrives i av medunderskriver.',
  [AttachmentAccessEnum.SENT_TO_ROL]: 'Vedlegget kan ikke skrives i fordi saken er hos ROL.',
  [AttachmentAccessEnum.NOT_SENT_TO_ROL]: 'Vedlegget kan ikke skrives i fordi saken er hos saksbehandler.',
  [AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT]: 'Vedlegget kan kun skrives i av tildelt saksbehandler.',
  [AttachmentAccessEnum.ROL_OWNED_ATTACHMENT]: 'Vedlegget kan kun skrives i av tildelt ROL.',
  [AttachmentAccessEnum.FEILREGISTRERT]: 'Vedlegget kan ikke skrives i fordi saken er feilregistrert.',
  [AttachmentAccessEnum.NOT_SUPPORTED]: null,
};

export const MOVE_ACCESS_ENUM_TO_TEXT: AttachmentAccessEnumMap = {
  [AttachmentAccessEnum.ALLOWED]: null,
  [AttachmentAccessEnum.NOT_ASSIGNED]: 'Vedlegget kan kun flyttes av tildelt saksbehandler.',
  [AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Vedlegget kan kun flyttes av tildelt saksbehandler eller tilsendt medunderskriver.',
  [AttachmentAccessEnum.FINISHED]: 'Vedlegget kan ikke flyttes fordi saken er ferdigstilt.',
  [AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER]: 'Vedlegget kan ikke flyttes fordi saken er hos medunderskriver.',
  [AttachmentAccessEnum.SENT_TO_ROL]: 'Vedlegget kan ikke flyttes fordi saken er hos ROL.',
  [AttachmentAccessEnum.NOT_SENT_TO_ROL]: 'Vedlegget kan ikke flyttes fordi saken er hos saksbehandler.',
  [AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT]: 'Vedlegget kan kun flyttes av tildelt saksbehandler.',
  [AttachmentAccessEnum.ROL_OWNED_ATTACHMENT]: 'Vedlegget kan kun flyttes av tildelt ROL.',
  [AttachmentAccessEnum.FEILREGISTRERT]: 'Vedlegget kan ikke flyttes fordi saken er feilregistrert.',
  [AttachmentAccessEnum.NOT_SUPPORTED]: null,
};

export const REMOVE_ACCESS_ENUM_TO_TEXT: AttachmentAccessEnumMap = {
  [AttachmentAccessEnum.ALLOWED]: null,
  [AttachmentAccessEnum.NOT_ASSIGNED]: 'Vedlegget kan kun slettes av tildelt saksbehandler.',
  [AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Vedlegget kan kun slettes av tildelt saksbehandler eller tilsendt medunderskriver.',
  [AttachmentAccessEnum.FINISHED]: 'Vedlegget kan ikke slettes fordi saken er ferdigstilt.',
  [AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER]: 'Vedlegget kan ikke slettes fordi saken er hos medunderskriver.',
  [AttachmentAccessEnum.SENT_TO_ROL]: 'Vedlegget kan ikke slettes fordi saken er hos ROL.',
  [AttachmentAccessEnum.NOT_SENT_TO_ROL]: 'Vedlegget kan ikke slettes fordi saken er hos saksbehandler.',
  [AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT]: 'Vedlegget kan kun slettes av tildelt saksbehandler.',
  [AttachmentAccessEnum.ROL_OWNED_ATTACHMENT]: 'Vedlegget kan kun slettes av tildelt ROL.',
  [AttachmentAccessEnum.FEILREGISTRERT]: 'Vedlegget kan ikke slettes fordi saken er feilregistrert.',
  [AttachmentAccessEnum.NOT_SUPPORTED]: null,
};

export const RENAME_ACCESS_ENUM_TO_TEXT: AttachmentAccessEnumMap = {
  [AttachmentAccessEnum.ALLOWED]: null,
  [AttachmentAccessEnum.NOT_ASSIGNED]: 'Vedlegget kan kun endres navn på av tildelt saksbehandler.',
  [AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Vedlegget kan kun endres navn på av tildelt saksbehandler eller tilsendt medunderskriver.',
  [AttachmentAccessEnum.FINISHED]: 'Vedlegget kan ikke endres navn på fordi saken er ferdigstilt.',
  [AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER]:
    'Vedlegget kan ikke endres navn på fordi saken er hos medunderskriver.',
  [AttachmentAccessEnum.SENT_TO_ROL]: 'Vedlegget kan ikke endres navn på fordi saken er hos ROL.',
  [AttachmentAccessEnum.NOT_SENT_TO_ROL]: 'Vedlegget kan ikke endres navn på fordi saken er hos saksbehandler.',
  [AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT]: 'Vedlegget kan kun endres navn på av tildelt saksbehandler.',
  [AttachmentAccessEnum.ROL_OWNED_ATTACHMENT]: 'Vedlegget kan kun endres navn på av tildelt ROL.',
  [AttachmentAccessEnum.FEILREGISTRERT]: 'Vedlegget kan ikke endres navn på fordi saken er feilregistrert.',
  [AttachmentAccessEnum.NOT_SUPPORTED]: null,
};
