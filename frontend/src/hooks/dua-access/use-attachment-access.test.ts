import { describe, expect, it } from 'bun:test';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { type AttachmentAccessParams, getAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { Filtype, VariantFormat } from '@app/types/arkiverte-documents';
import {
  CreatorRole,
  DistribusjonsType,
  DocumentTypeEnum,
  type IFileDocument,
  type ISmartDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';

const SMART_PARENT: ISmartDocument<null> = {
  id: 'smart-parent',
  tittel: 'Test Smart Document',
  created: '2021-01-01',
  modified: '2021-01-01',
  parentId: null,
  dokumentTypeId: DistribusjonsType.BREV,
  isMarkertAvsluttet: false,
  creator: {
    employee: { navIdent: 'Z123456', navn: 'Ola Nordmann' },
    creatorRole: CreatorRole.KABAL_SAKSBEHANDLING,
  },
  mottakerList: [],
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
  version: 1,
  language: Language.NB,
  content: [],
};

const ROL_QUESTIONS: ISmartDocument<null> = {
  ...SMART_PARENT,
  id: 'rol-questions',
  templateId: TemplateIdEnum.ROL_QUESTIONS,
};

const BASE_ATTACHMENT: Omit<IFileDocument<string>, 'type' | 'isSmartDokument'> = {
  id: '1',
  tittel: 'Test Document',
  created: '2021-01-01',
  modified: '2021-01-01',
  parentId: '2',
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

const UPLOADED_PARENT: IFileDocument<null> = {
  id: 'uploaded-parent',
  tittel: 'Test Uploaded Document',
  created: '2021-01-01',
  modified: '2021-01-01',
  parentId: null,
  dokumentTypeId: DistribusjonsType.BREV,
  isMarkertAvsluttet: false,
  creator: {
    employee: { navIdent: 'Z123456', navn: 'Ola Nordmann' },
    creatorRole: CreatorRole.KABAL_SAKSBEHANDLING,
  },
  mottakerList: [],
  isSmartDokument: false,
  type: DocumentTypeEnum.UPLOADED,
  avsender: null,
  inngaaendeKanal: null,
  datoMottatt: null,
};

const UPLOADED_ATTACHMENT: IFileDocument<string> = {
  ...BASE_ATTACHMENT,
  parentId: UPLOADED_PARENT.id,
  type: DocumentTypeEnum.UPLOADED,
  isSmartDokument: false,
  dokumentTypeId: DistribusjonsType.NOTAT,
  isMarkertAvsluttet: false,
};

const JOURNALFOERT_ATTACHMENT: JournalfoertDokument = {
  ...BASE_ATTACHMENT,
  parentId: SMART_PARENT.id,
  type: DocumentTypeEnum.JOURNALFOERT,
  isSmartDokument: false,
  dokumentTypeId: DistribusjonsType.NOTAT,
  isMarkertAvsluttet: false,
  journalfoertDokumentReference: {
    datoOpprettet: '2021-01-01',
    journalpostId: '123456789',
    dokumentInfoId: '987654321',
    hasAccess: true,
    sortKey: '20210101000000',
    varianter: [
      {
        filtype: Filtype.PDF,
        format: VariantFormat.ARKIV,
        hasAccess: true,
        skjerming: null,
      },
    ],
  },
};

const JOURNALFOERT_ROL_ATTACHMENT: JournalfoertDokument = {
  ...JOURNALFOERT_ATTACHMENT,
  creator: {
    employee: { navIdent: 'Z654321', navn: 'Lege Over' },
    creatorRole: CreatorRole.KABAL_ROL,
  },
};

const ROL_ANSWERS: ISmartDocument<string> = {
  ...BASE_ATTACHMENT,
  parentId: ROL_QUESTIONS.id,
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: DocumentTypeEnum.SMART,
  creator: {
    employee: { navIdent: 'Z654321', navn: 'Lege Over' },
    creatorRole: CreatorRole.KABAL_ROL,
  },
  isSmartDokument: true,
  version: 1,
  language: Language.NB,
  content: [],
};

const BASE_PARAMS: AttachmentAccessParams = {
  isFinished: false,
  isFeilregistrert: false,
  isCaseTildelt: () => false,
  isMedunderskriver: () => false,
  isRolUser: false,
  isSentToMedunderskriver: () => false,
  isSentToRol: false,
  isAssignedRol: false,
  isTildeltSaksbehandler: () => false,
};

describe('Attachment access', () => {
  describe('Feilregistrerte cases', () => {
    describe('Uploaded attachment', () => {
      it('should allow read-only access', () => {
        const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
          ...BASE_PARAMS,
          isFeilregistrert: true,
        });

        expect(access).toEqual({
          read: true,
          write: AttachmentAccessEnum.NOT_SUPPORTED,
          remove: AttachmentAccessEnum.FEILREGISTRERT,
          rename: AttachmentAccessEnum.FEILREGISTRERT,
          move: AttachmentAccessEnum.FEILREGISTRERT,
        });
      });
    });

    describe('Smart document attachment', () => {
      it('should allow read-only access to journalført attachment', () => {
        const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
          ...BASE_PARAMS,
          isFeilregistrert: true,
        });

        expect(access).toEqual({
          read: true,
          write: AttachmentAccessEnum.NOT_SUPPORTED,
          remove: AttachmentAccessEnum.FEILREGISTRERT,
          rename: AttachmentAccessEnum.NOT_SUPPORTED,
          move: AttachmentAccessEnum.FEILREGISTRERT,
        });
      });
    });

    describe('ROL questions attachment', () => {
      it('should allow read-only access to saksbehandler attachment', () => {
        const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
          ...BASE_PARAMS,
          isFeilregistrert: true,
        });

        expect(access).toEqual({
          read: true,
          write: AttachmentAccessEnum.NOT_SUPPORTED,
          remove: AttachmentAccessEnum.FEILREGISTRERT,
          rename: AttachmentAccessEnum.NOT_SUPPORTED,
          move: AttachmentAccessEnum.FEILREGISTRERT,
        });
      });

      it('should allow read-only access to ROL attachment', () => {
        const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
          ...BASE_PARAMS,
          isFeilregistrert: true,
        });

        expect(access).toEqual({
          read: true,
          write: AttachmentAccessEnum.NOT_SUPPORTED,
          remove: AttachmentAccessEnum.FEILREGISTRERT,
          rename: AttachmentAccessEnum.NOT_SUPPORTED,
          move: AttachmentAccessEnum.FEILREGISTRERT,
        });
      });

      it('should allow read-only access to ROL answers', () => {
        const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
          ...BASE_PARAMS,
          isFeilregistrert: true,
        });

        expect(access).toEqual({
          read: true,
          write: AttachmentAccessEnum.FEILREGISTRERT,
          remove: AttachmentAccessEnum.FEILREGISTRERT,
          rename: AttachmentAccessEnum.FEILREGISTRERT,
          move: AttachmentAccessEnum.FEILREGISTRERT,
        });
      });
    });
  });

  describe('Unassigned cases', () => {
    describe('Unassigned users', () => {
      describe('Uploaded attachment', () => {
        it('should allow full access', () => {
          const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, BASE_PARAMS);

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.ALLOWED,
            rename: AttachmentAccessEnum.ALLOWED,
            move: AttachmentAccessEnum.ALLOWED,
          });
        });
      });

      describe('Smart document attachment', () => {
        it('should allow full access to journalført attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, BASE_PARAMS);

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.NOT_ASSIGNED,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.NOT_ASSIGNED,
          });
        });
      });

      describe('ROL questions attachment', () => {
        it('should allow read-only access to saksbehandler attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, BASE_PARAMS);

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.NOT_ASSIGNED,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.NOT_ASSIGNED,
          });
        });

        it('should allow read-only access to ROL attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, BASE_PARAMS);

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
          });
        });

        it('should allow read-only access to ROL answers', () => {
          const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, BASE_PARAMS);

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
          });
        });
      });
    });

    describe('ROL users', () => {
      describe('Uploaded attachment', () => {
        it('should allow read-only access', () => {
          const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.NOT_ASSIGNED,
            rename: AttachmentAccessEnum.NOT_ASSIGNED,
            move: AttachmentAccessEnum.NOT_ASSIGNED,
          });
        });
      });

      describe('Smart document attachment', () => {
        it('should allow read-only access to journalført attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.NOT_ASSIGNED,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.NOT_ASSIGNED,
          });
        });
      });

      describe('ROL questions attachment', () => {
        it('should allow read-only access to saksbehandler attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.NOT_ASSIGNED,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.NOT_ASSIGNED,
          });
        });

        it('should allow read-only access to ROL attachment', () => {
          const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.NOT_SUPPORTED,
            remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            rename: AttachmentAccessEnum.NOT_SUPPORTED,
            move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
          });
        });

        it('should allow read-only access to ROL answers', () => {
          const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            read: true,
            write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
          });
        });
      });
    });
  });

  describe('Assigned cases', () => {
    describe('With saksbehandler', () => {
      describe('Assigned saksbehandler', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow full access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_ASSIGNED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              rename: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });
    });

    describe('With medunderskriver', () => {
      describe('Assigned saksbehandler', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_ASSIGNED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });
    });

    describe('With ROL', () => {
      describe('Assigned saksbehandler', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow full access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow full access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.SENT_TO_ROL,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.SENT_TO_ROL,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_ASSIGNED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
            });
          });

          it('should allow full access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });

          it('should allow full access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ALLOWED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccess(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ALLOWED,
              rename: AttachmentAccessEnum.ALLOWED,
              move: AttachmentAccessEnum.ALLOWED,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.NOT_ASSIGNED,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.NOT_ASSIGNED,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccess(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.NOT_SUPPORTED,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.NOT_SUPPORTED,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccess(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              read: true,
              write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            });
          });
        });
      });
    });
  });
});
