import { describe, expect, it } from 'bun:test';
import { type CanEditDocumentParams, canEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import {
  CreatorRole,
  DistribusjonsType,
  DocumentTypeEnum,
  type IBaseDocument,
  type ISmartDocument,
  type JournalfoertDokument,
  type JournalfoertDokumentReference,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';

const EMPLOYEE = { navIdent: 'Z123456', navn: 'Ola Nordmann' };

const BASE_DOCUMENT: IBaseDocument = {
  id: '1',
  created: '2021-01-01',
  type: DocumentTypeEnum.UPLOADED,
  creator: { creatorRole: CreatorRole.KABAL_SAKSBEHANDLING, employee: EMPLOYEE },
  dokumentTypeId: DistribusjonsType.BREV,
  isMarkertAvsluttet: false,
  isSmartDokument: false,
  modified: '2021-01-01',
  parentId: '1',
  mottakerList: [],
  tittel: 'Tittel',
};

const SMART_DOCUMENT: ISmartDocument = {
  ...BASE_DOCUMENT,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
  templateId: TemplateIdEnum.NOTAT,
  content: [],
  version: 1,
  language: Language.NB,
};

const BASE_JD_REFERENCE: JournalfoertDokumentReference = {
  harTilgangTilArkivvariant: true,
  datoOpprettet: '2021-01-01',
  sortKey: '1',
  journalpostId: '1',
  dokumentInfoId: '1',
};

const BASE_JD: JournalfoertDokument = {
  ...BASE_DOCUMENT,
  parentId: '1',
  isSmartDokument: false,
  type: DocumentTypeEnum.JOURNALFOERT,
  journalfoertDokumentReference: BASE_JD_REFERENCE,
};

// Default params will skip through all ifs in canEditDocument
const BASE_PARAMS: CanEditDocumentParams = {
  parentIsMarkertAvsluttet: false,
  isFeilregistrert: false,
  document: BASE_JD,
  isFullfoert: false,
  medunderskriverFlowState: FlowState.NOT_SENT,
  hasMerkantilRole: false,
  hasSaksbehandlerRole: false,
  hasKrolRole: false,
  isRol: false,
  isTildeltSaksbehandler: false,
  rolFlowState: null,
};

describe('canEditDocument', () => {
  it('should return false with default params', () => {
    expect(canEditDocument(BASE_PARAMS)).toBe(false);
  });

  it('should return false if parent is markert avsluttet', () => {
    expect(canEditDocument({ ...BASE_PARAMS, parentIsMarkertAvsluttet: true })).toBe(false);
  });

  it('should return false if behandling is feilregistrert', () => {
    expect(canEditDocument({ ...BASE_PARAMS, isFeilregistrert: true })).toBe(false);
  });

  it('should return false if document is null', () => {
    expect(canEditDocument({ ...BASE_PARAMS, document: null })).toBe(false);
  });

  it('should return false if document is markert avsluttet', () => {
    expect(canEditDocument({ ...BASE_PARAMS, document: { ...BASE_JD, isMarkertAvsluttet: true } })).toBe(false);
  });

  it('should return false if user does not have tilgang til arkivvariant', () => {
    const journalfoertDokumentReference = {
      ...BASE_JD_REFERENCE,
      type: DocumentTypeEnum.JOURNALFOERT,
      harTilgangTilArkivvariant: false,
    };
    const params = { ...BASE_PARAMS, document: { ...BASE_JD, journalfoertDokumentReference } };

    expect(canEditDocument(params)).toBe(false);
  });

  describe('oppgave is fullført', () => {
    it('should return false if user does not have saksbehandler role', () => {
      expect(canEditDocument({ ...BASE_PARAMS, isFullfoert: true, hasSaksbehandlerRole: false })).toBe(false);
    });

    it('should return true if user has saksbehandler role', () => {
      expect(canEditDocument({ ...BASE_PARAMS, isFullfoert: true, hasSaksbehandlerRole: true })).toBe(true);
    });
  });

  it('should return false if medunderskriver flow state is sent', () => {
    expect(canEditDocument({ ...BASE_PARAMS, medunderskriverFlowState: FlowState.SENT })).toBe(false);
  });

  it('should return true if user is merkantil', () => {
    expect(canEditDocument({ ...BASE_PARAMS, hasMerkantilRole: true })).toBe(true);
  });

  describe('user is tildelt saksbehandler', () => {
    it('should return false if creator role is not KABAL_SAKSBEHANDLING', () => {
      const creator = { creatorRole: CreatorRole.KABAL_MEDUNDERSKRIVER, employee: EMPLOYEE };
      const document = { ...BASE_JD, creator };
      expect(canEditDocument({ ...BASE_PARAMS, isTildeltSaksbehandler: true, document })).toBe(false);
    });

    it('should return true if creator role is KABAL_SAKSBEHANDLING', () => {
      const creator = { creatorRole: CreatorRole.KABAL_SAKSBEHANDLING, employee: EMPLOYEE };
      const document = { ...BASE_JD, creator };
      expect(canEditDocument({ ...BASE_PARAMS, isTildeltSaksbehandler: true, document })).toBe(true);
    });
  });

  describe('user is rol', () => {
    it('should return false if flow state is not sent', () => {
      expect(canEditDocument({ ...BASE_PARAMS, isRol: true, rolFlowState: FlowState.NOT_SENT })).toBe(false);
    });

    it('should return false if flow state is sent, but user does not have tilgang to arkivvariant', () => {
      const journalfoertDokumentReference = { ...BASE_JD_REFERENCE, harTilgangTilArkivvariant: false };
      const document = { ...BASE_JD, journalfoertDokumentReference };

      expect(canEditDocument({ ...BASE_PARAMS, isRol: true, rolFlowState: FlowState.SENT, document })).toBe(false);
    });

    it('should return false if flow state is sent and user has tilgang to arkivvariant, but creator role is not KABAL_ROL', () => {
      const journalfoertDokumentReference = { ...BASE_JD_REFERENCE, harTilgangTilArkivvariant: false };
      const creator = { creatorRole: CreatorRole.KABAL_SAKSBEHANDLING, employee: EMPLOYEE };
      const document = { ...BASE_JD, journalfoertDokumentReference, creator };

      expect(canEditDocument({ ...BASE_PARAMS, isRol: true, rolFlowState: FlowState.SENT, document })).toBe(false);
    });

    it('should return true if flow state is sent and user has tilgang to arkivvariant and creator role is KABAL_ROL', () => {
      const creator = { creatorRole: CreatorRole.KABAL_ROL, employee: EMPLOYEE };
      const document = { ...SMART_DOCUMENT, creator };
      const params = { ...BASE_PARAMS, isRol: true, rolFlowState: FlowState.SENT, document };

      expect(canEditDocument(params)).toBe(true);
    });
  });

  describe('Svar fra rådgivende overlege', () => {
    const rolAnswers = { ...SMART_DOCUMENT, templateId: TemplateIdEnum.ROL_ANSWERS };

    it('should return true if user is assigned ROL', () => {
      const creator = { creatorRole: CreatorRole.KABAL_ROL, employee: EMPLOYEE };
      const document = { ...rolAnswers, creator };
      const params = {
        ...BASE_PARAMS,
        isRol: true,
        hasKrolRole: false,
        hasMerkantilRole: false,
        isTildeltSaksbehandler: false,
        rolFlowState: FlowState.SENT,
        document,
      };

      expect(canEditDocument(params)).toBe(true);
    });

    it('should return true if user is KROL', () => {
      const creator = { creatorRole: CreatorRole.KABAL_ROL, employee: EMPLOYEE };
      const document = { ...rolAnswers, creator };
      const params = {
        ...BASE_PARAMS,
        isRol: false,
        hasKrolRole: true,
        hasMerkantilRole: false,
        isTildeltSaksbehandler: false,
        rolFlowState: FlowState.SENT,
        document,
      };

      expect(canEditDocument(params)).toBe(true);
    });

    it('should return false if user is assigned saksbehandler', () => {
      const creator = { creatorRole: CreatorRole.KABAL_ROL, employee: EMPLOYEE };
      const document = { ...rolAnswers, creator };
      const params = {
        ...BASE_PARAMS,
        isRol: false,
        hasKrolRole: false,
        hasMerkantilRole: false,
        isTildeltSaksbehandler: true,
        rolFlowState: FlowState.SENT,
        document,
      };

      expect(canEditDocument(params)).toBe(false);
    });

    it('should return false if user is merkantil', () => {
      const creator = { creatorRole: CreatorRole.KABAL_ROL, employee: EMPLOYEE };
      const document = { ...rolAnswers, creator };
      const params = {
        ...BASE_PARAMS,
        isRol: false,
        hasKrolRole: false,
        hasMerkantilRole: true,
        isTildeltSaksbehandler: false,
        rolFlowState: FlowState.SENT,
        document,
      };

      expect(canEditDocument(params)).toBe(false);
    });
  });
});
