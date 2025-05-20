import { describe, expect, it } from 'bun:test';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import { type DocumentAccessParams, getDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import {
  CreatorRole,
  DistribusjonsType,
  DocumentTypeEnum,
  type IFileDocument,
  type ISmartDocument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';

const BASE_DOCUMENT: Omit<IFileDocument<null>, 'type' | 'isSmartDokument'> = {
  id: '1',
  tittel: 'Test Document',
  created: '2021-01-01',
  modified: '2021-01-01',
  parentId: null,
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
  type: DocumentTypeEnum.UPLOADED,
  isSmartDokument: false,
  dokumentTypeId: DistribusjonsType.NOTAT,
  isMarkertAvsluttet: false,
};

const SMART_NOTAT: ISmartDocument<null> = {
  ...BASE_DOCUMENT,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
  dokumentTypeId: DistribusjonsType.NOTAT,
  templateId: TemplateIdEnum.NOTAT,
  content: [],
  version: 1,
  language: Language.NB,
};

const ROL_QUESTIONS: ISmartDocument<null> = {
  ...SMART_NOTAT,
  templateId: TemplateIdEnum.ROL_QUESTIONS,
};

const BASE_PARAMS: DocumentAccessParams = {
  isFinished: false,
  isFeilregistrert: false,
  isCaseTildelt: () => false,
  isMedunderskriver: () => false,
  isRolUser: false,
  isSentToMedunderskriver: () => false,
  isSentToRol: false,
  isAssignedRol: false,
  isTildeltSaksbehandler: () => false,
  isReturnedFromRol: () => false,
};

describe('Document access', () => {
  describe('Finished cases', () => {
    describe('Uploaded document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccess(UPLOADED_NOTAT, [], { ...BASE_PARAMS, isFinished: true });
        expect(access).toEqual({
          read: true,
          write: DocumentAccessEnum.NOT_SUPPORTED,
          uploadAttachments: DocumentAccessEnum.ALLOWED,
          referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
          remove: DocumentAccessEnum.ALLOWED,
          changeType: DocumentAccessEnum.ALLOWED,
          rename: DocumentAccessEnum.ALLOWED,
          finish: DocumentAccessEnum.ALLOWED,
        });
      });
    });

    describe('Smart document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccess(SMART_NOTAT, [], { ...BASE_PARAMS, isFinished: true });
        expect(access).toEqual({
          read: true,
          write: DocumentAccessEnum.ALLOWED,
          uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
          referAttachments: DocumentAccessEnum.ALLOWED,
          remove: DocumentAccessEnum.ALLOWED,
          changeType: DocumentAccessEnum.ALLOWED,
          rename: DocumentAccessEnum.ALLOWED,
          finish: DocumentAccessEnum.ALLOWED,
        });
      });
    });

    describe('ROL questions document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccess(ROL_QUESTIONS, [], { ...BASE_PARAMS, isFinished: true });
        expect(access).toEqual({
          read: true,
          write: DocumentAccessEnum.ALLOWED,
          uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
          referAttachments: DocumentAccessEnum.ALLOWED,
          remove: DocumentAccessEnum.ALLOWED,
          changeType: DocumentAccessEnum.NOT_SUPPORTED,
          rename: DocumentAccessEnum.ALLOWED,
          finish: DocumentAccessEnum.ALLOWED,
        });
      });
    });
  });

  describe('Feilregistrerte cases', () => {
    describe('Uploaded document', () => {
      it('should only allow read access', () => {
        const access = getDocumentAccess(UPLOADED_NOTAT, [], { ...BASE_PARAMS, isFeilregistrert: true });
        expect(access).toEqual({
          read: true,
          write: DocumentAccessEnum.NOT_SUPPORTED,
          uploadAttachments: DocumentAccessEnum.CASE_FEILREGISTRERT,
          referAttachments: DocumentAccessEnum.CASE_FEILREGISTRERT,
          remove: DocumentAccessEnum.CASE_FEILREGISTRERT,
          changeType: DocumentAccessEnum.CASE_FEILREGISTRERT,
          rename: DocumentAccessEnum.CASE_FEILREGISTRERT,
          finish: DocumentAccessEnum.CASE_FEILREGISTRERT,
        });
      });
    });
  });

  describe('Unassigned cases', () => {
    it('should allow full access to uploaded notat for all users', () => {
      const access = getDocumentAccess(UPLOADED_NOTAT, [], BASE_PARAMS);

      expect(access).toEqual({
        read: true,
        write: DocumentAccessEnum.NOT_SUPPORTED,
        uploadAttachments: DocumentAccessEnum.ALLOWED,
        referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
        remove: DocumentAccessEnum.ALLOWED,
        changeType: DocumentAccessEnum.ALLOWED,
        rename: DocumentAccessEnum.ALLOWED,
        finish: DocumentAccessEnum.ALLOWED,
      });
    });

    it('should allow full access to smart document for all users', () => {
      const access = getDocumentAccess(SMART_NOTAT, [], BASE_PARAMS);

      expect(access).toEqual({
        read: true,
        write: DocumentAccessEnum.ALLOWED,
        uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
        referAttachments: DocumentAccessEnum.ALLOWED,
        remove: DocumentAccessEnum.ALLOWED,
        changeType: DocumentAccessEnum.ALLOWED,
        rename: DocumentAccessEnum.ALLOWED,
        finish: DocumentAccessEnum.ALLOWED,
      });
    });
  });

  describe('Assigned cases', () => {
    describe('With saksbehandler', () => {
      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
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
            write: DocumentAccessEnum.ALLOWED,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.ALLOWED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccess(SMART_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_ASSIGNED,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            remove: DocumentAccessEnum.NOT_ASSIGNED,
            changeType: DocumentAccessEnum.NOT_ASSIGNED,
            rename: DocumentAccessEnum.NOT_ASSIGNED,
            finish: DocumentAccessEnum.NOT_ASSIGNED,
          });
        });
      });
    });

    describe('With medunderskriver', () => {
      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccess(SMART_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.SENT_TO_MU,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.SENT_TO_MU,
            remove: DocumentAccessEnum.SENT_TO_MU,
            changeType: DocumentAccessEnum.SENT_TO_MU,
            rename: DocumentAccessEnum.SENT_TO_MU,
            finish: DocumentAccessEnum.SENT_TO_MU,
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow write access to smart document', () => {
          const access = getDocumentAccess(SMART_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.ALLOWED,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            remove: DocumentAccessEnum.NOT_ASSIGNED,
            changeType: DocumentAccessEnum.NOT_ASSIGNED,
            rename: DocumentAccessEnum.NOT_ASSIGNED,
            finish: DocumentAccessEnum.NOT_ASSIGNED,
          });
        });
      });
    });

    describe('With ROL', () => {
      describe('Assigned ROL', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccess(SMART_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_ASSIGNED,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            remove: DocumentAccessEnum.NOT_ASSIGNED,
            changeType: DocumentAccessEnum.NOT_ASSIGNED,
            rename: DocumentAccessEnum.NOT_ASSIGNED,
            finish: DocumentAccessEnum.NOT_ASSIGNED,
          });
        });

        it('should allow some access to ROL-questions document', () => {
          const access = getDocumentAccess(ROL_QUESTIONS, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.ALLOWED,
            remove: DocumentAccessEnum.NOT_ASSIGNED,
            changeType: DocumentAccessEnum.NOT_SUPPORTED,
            rename: DocumentAccessEnum.NOT_ASSIGNED,
            finish: DocumentAccessEnum.NOT_ASSIGNED,
          });
        });
      });

      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccess(UPLOADED_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.NOT_SUPPORTED,
            uploadAttachments: DocumentAccessEnum.ALLOWED,
            referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow full access to smart document', () => {
          const access = getDocumentAccess(SMART_NOTAT, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.ALLOWED,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.ALLOWED,
            remove: DocumentAccessEnum.ALLOWED,
            changeType: DocumentAccessEnum.ALLOWED,
            rename: DocumentAccessEnum.ALLOWED,
            finish: DocumentAccessEnum.ALLOWED,
          });
        });

        it('should allow read-only access to ROL-questions document', () => {
          const access = getDocumentAccess(ROL_QUESTIONS, [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            read: true,
            write: DocumentAccessEnum.SENT_TO_ROL,
            uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            referAttachments: DocumentAccessEnum.SENT_TO_ROL,
            remove: DocumentAccessEnum.SENT_TO_ROL,
            changeType: DocumentAccessEnum.NOT_SUPPORTED,
            rename: DocumentAccessEnum.SENT_TO_ROL,
            finish: DocumentAccessEnum.ROL_REQUIRED,
          });
        });
      });
    });
  });
});
