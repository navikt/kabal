import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';

export type DocumentAccessEnumMap = Record<DocumentAccessEnum, string | null>;

export const FINISH_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Dokumentet kan kun ferdigstilles av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Dokumentet kan kun ferdigstilles av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Dokumentet kan kun ferdigstilles av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]:
    'Dokumentet kan kun ferdigstilles av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Dokumentet er allerede ferdigstilt.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Dokumentet må returneres av ROL før det kan ferdigstilles.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Dokumentet kan ikke ferdigstilles fordi saken er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Dokumentet kan ikke ferdigstilles fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Dokumentet kan ikke ferdigstilles av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Dokumentet kan kun ferdigstilles av tildelt saksbehandler.', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: 'Dokumentet kan ikke ferdigstilles fordi det har vedlegg lagt til av ROL.', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Dokumentet kan ikke ferdigstilles fordi saken er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const CHANGE_TYPE_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Dokumentet kan kun endres type på av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Dokumentet kan kun endres type på av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Dokumentet kan kun endres type på av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]:
    'Dokumentet kan kun endres type på av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Dokumentet kan ikke endres type på fordi saken er ferdigstilt.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Dokumentet må returneres av ROL før dokumentet kan endres type på.', // Impossible case.
  [DocumentAccessEnum.SENT_TO_MU]: 'Dokumentet kan ikke endres type på fordi saken er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Dokumentet kan ikke endres type på fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Dokumentet kan ikke endres type på av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Dokumentet kan ikke endres type på fordi det er ROL-spørsmål.',
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: 'Dokumentet kan ikke endre type fordi det har vedlegg lagt til av ROL.', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Dokumentet kan ikke endres type på fordi saken er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const REMOVE_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Dokumentet kan kun fjernes av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Dokumentet kan kun fjernes av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Dokumentet kan kun fjernes av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]: 'Dokumentet kan kun fjernes av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Dokumentet kan ikke fjernes fordi saken er ferdigstilt.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Dokumentet kan ikke fjernes før ROL har returnert saken.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Dokumentet kan ikke fjernes fordi saken er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Dokumentet kan ikke fjernes fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Dokumentet kan ikke fjernes av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Dokumentet kan kun fjernes av tildelt saksbehandler.', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: 'Dokumentet kan ikke fjernes fordi det har vedlegg lagt til av ROL.',
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Dokumentet kan ikke fjernes fordi saken er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const RENAME_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Dokumentet kan kun endres navn på av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Dokumentet kan kun endres navn på av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Dokumentet kan kun endres navn på av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]:
    'Dokumentet kan kun endres navn på av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Dokumentet kan ikke endres navn på fordi saken er ferdigstilt.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Dokumentet kan ikke endres navn på før saken er returnert av ROL.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Dokumentet kan ikke endres navn på fordi saken er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Dokumentet kan ikke endres navn på fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Dokumentet kan ikke endres navn på av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Dokumentet kan ikke endres navn på.', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: 'Dokumentet kan ikke endres navn på fordi det har vedlegg lagt til av ROL.', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Dokumentet kan ikke endres navn på fordi saken er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const WRITE_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Dokumentet kan kun skrives i av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Dokumentet kan kun skrives i av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Dokumentet kan kun skrives i av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]: 'Dokumentet kan kun skrives i av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Dokumentet kan ikke skrives i fordi det er ferdigstilt.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Dokumentet kan ikke skrives i før ROL har returnert saken.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Dokumentet kan ikke skrives i fordi saken er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Dokumentet kan ikke skrives i fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Dokumentet kan ikke skrives i av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: '', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: 'Dokumentet kan ikke skrives i fordi det har vedlegg lagt til av ROL.', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Dokumentet kan ikke skrives i fordi saken er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const UPLOAD_ATTACHMENTS_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Vedlegg kan kun lastes opp av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Vedlegg kan kun lastes opp av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Vedlegg kan kun lastes opp av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]: 'Vedlegg kan kun lastes opp av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Vedlegg kan ikke lastes opp til ferdigstilte dokumenter.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Vedlegg kan ikke lastes opp fordi saken er hos ROL.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Vedlegg kan ikke lastes opp på saker som er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Vedlegg kan ikke lastes opp, fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Vedlegg kan ikke lastes opp av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Vedlegg kan ikke lastes opp til ROL-spørsmål.', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: '', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Vedlegg kan ikke lastes opp på feilregistrerte saker.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};

export const REFER_ATTACHMENTS_ACCESS_ENUM_TO_TEXT: DocumentAccessEnumMap = {
  [DocumentAccessEnum.ALLOWED]: null,
  [DocumentAccessEnum.NOT_ASSIGNED]: 'Journalførte vedlegg kan kun legges til av tildelt saksbehandler.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]:
    'Journalførte vedlegg kan kun legges til av tildelt saksbehandler eller tilsendt medunderskriver.',
  [DocumentAccessEnum.NOT_ASSIGNED_ROL]: 'Journalførte vedlegg kan kun legges til av tilsendt ROL.',
  [DocumentAccessEnum.NOT_ASSIGNED_OR_ROL]:
    'Journalførte vedlegg kan kun legges til av tildelt saksbehandler eller tilsendt ROL.',
  [DocumentAccessEnum.DOCUMENT_FINISHED]: 'Journalførte vedlegg kan ikke legges til ferdigstilte dokumenter.',
  [DocumentAccessEnum.ROL_REQUIRED]: 'Journalførte vedlegg kan ikke legges til fordi saken er hos ROL.',
  [DocumentAccessEnum.SENT_TO_MU]: 'Journalførte vedlegg kan ikke legges til i saker som er hos medunderskriver.',
  [DocumentAccessEnum.SENT_TO_ROL]: 'Journalførte vedlegg kan ikke legges til fordi saken er hos ROL.',
  [DocumentAccessEnum.ROL_USER]: 'Journalførte vedlegg kan ikke legges til av ROL.',
  [DocumentAccessEnum.ROL_QUESTIONS]: 'Journalførte vedlegg kan ikke legges til ROL-spørsmål.', // Impossible case.
  [DocumentAccessEnum.HAS_ROL_ATTACHMENTS]: '', // Impossible case.
  [DocumentAccessEnum.CASE_FEILREGISTRERT]: 'Journalførte vedlegg kan ikke legges til i saker som er feilregistrert.',
  [DocumentAccessEnum.NOT_SUPPORTED]: null,
};
