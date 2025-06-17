import { describe, expect, it } from 'bun:test';
import {
  ChangeTypeStateEnum,
  type DocumentAccessParams,
  FinishStateEnum,
  getDocumentAccess,
} from '@app/hooks/dua-access/use-document-access';
import {
  CreatorRole,
  DistribusjonsType,
  DocumentTypeEnum,
  type IFileDocument,
  type ISmartDocument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';

const BASE_DOCUMENT: Omit<IFileDocument<null>, 'type' | 'isSmartDokument' | 'parentId'> = {
  id: '1',
  tittel: 'Test Document',
  created: '2021-01-01',
  modified: '2021-01-01',
  dokumentTypeId: DistribusjonsType.NOTAT,
  isMarkertAvsluttet: false,
  avsender: null,
  inngaaendeKanal: null,
  creator: {
    employee: { navIdent: 'Z123456', navn: 'Ola Nordmann' },
    creatorRole: CreatorRole.KABAL_SAKSBEHANDLING,
  },
  datoMottatt: null,
  mottakerList: [],
};

const UPLOADED_NOTAT: IFileDocument<null> = {
  ...BASE_DOCUMENT,
  parentId: null,
  type: DocumentTypeEnum.UPLOADED,
  isSmartDokument: false,
  dokumentTypeId: DistribusjonsType.NOTAT,
  isMarkertAvsluttet: false,
};

const SMART_NOTAT: ISmartDocument<null> = {
  ...BASE_DOCUMENT,
  parentId: null,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
  dokumentTypeId: DistribusjonsType.NOTAT,
  templateId: TemplateIdEnum.NOTAT,
  content: [],
  version: 1,
  language: Language.NB,
};

const BASE_PARAMS: DocumentAccessParams = {
  isFeilregistrert: false,
  isCaseTildelt: () => false,
  isKrolUser: false,
  isMedunderskriver: () => false,
  isRolUser: false,
  isSentToMedunderskriver: () => false,
  isSentToRol: false,
  isAssignedRol: false,
  isTildeltSaksbehandler: () => false,
  isReturnedFromRol: () => false,
};

describe('Document access', () => {
  describe('Feilregistrerte cases', () => {
    it('should only allow read access', () => {
      const access = getDocumentAccess(UPLOADED_NOTAT, [], { ...BASE_PARAMS, isFeilregistrert: true });
      expect(access).toEqual({
        read: true,
        write: false,
        uploadAttachments: false,
        referAttachments: false,
        remove: false,
        changeType: ChangeTypeStateEnum.FEILREGISTRERT,
        rename: false,
        finish: FinishStateEnum.FEILREGISTRERT,
      });
    });
  });

  describe('KROL users', () => {
    it('should only allow read access', () => {
      const access = getDocumentAccess(UPLOADED_NOTAT, [], { ...BASE_PARAMS, isKrolUser: true });
      expect(access).toEqual({
        read: true,
        write: false,
        uploadAttachments: false,
        referAttachments: false,
        remove: false,
        changeType: ChangeTypeStateEnum.ROL_KROL,
        rename: false,
        finish: FinishStateEnum.ROL_KROL,
      });
    });
  });

  describe('Unassigned cases', () => {
    it('should allow full access to uploaded notat for all users', () => {
      const access = getDocumentAccess(UPLOADED_NOTAT, [], { ...BASE_PARAMS });

      expect(access).toEqual({
        read: true,
        write: true,
        uploadAttachments: true,
        referAttachments: false,
        remove: true,
        changeType: ChangeTypeStateEnum.ALLOWED,
        rename: true,
        finish: FinishStateEnum.ALLOWED,
      });
    });

    it('should allow full access to smart document for all users', () => {
      const access = getDocumentAccess(SMART_NOTAT, [], { ...BASE_PARAMS });

      expect(access).toEqual({
        read: true,
        write: true,
        uploadAttachments: false,
        referAttachments: true,
        remove: true,
        changeType: ChangeTypeStateEnum.ALLOWED,
        rename: true,
        finish: FinishStateEnum.ALLOWED,
      });
    });
  });

  describe('Assigned cases', () => {
    describe('Assigned saksbehandler', () => {
      it('should allow full access to uploaded notat', () => {
        const access = getDocumentAccess(UPLOADED_NOTAT, [], {
          ...BASE_PARAMS,
          isCaseTildelt: () => true,
          isTildeltSaksbehandler: () => true,
        });

        expect(access).toEqual({
          read: true,
          write: true,
          uploadAttachments: true,
          referAttachments: false,
          remove: true,
          changeType: ChangeTypeStateEnum.ALLOWED,
          rename: true,
          finish: FinishStateEnum.ALLOWED,
        });
      });

      it('should allow full access to smart document', () => {
        const access = getDocumentAccess(SMART_NOTAT, [], {
          ...BASE_PARAMS,
          isCaseTildelt: () => true,
          isTildeltSaksbehandler: () => true,
        });

        expect(access).toEqual({
          read: true,
          write: true,
          uploadAttachments: false,
          referAttachments: true,
          remove: true,
          changeType: ChangeTypeStateEnum.ALLOWED,
          rename: true,
          finish: FinishStateEnum.ALLOWED,
        });
      });
    });
  });
});
