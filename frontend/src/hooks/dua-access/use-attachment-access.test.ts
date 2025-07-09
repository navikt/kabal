import { describe, expect, it } from 'bun:test';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { type AttachmentAccessDocument, getAttachmentAccessMap } from '@app/hooks/dua-access/attachment/access';
import type { DetermineParentDocumentType } from '@app/hooks/dua-access/attachment/parent';
import type { DocumentAccessParams } from '@app/hooks/dua-access/shared/params';
import { CreatorRole, DocumentTypeEnum } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const SMART_PARENT: DetermineParentDocumentType = {
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
};

const ROL_QUESTIONS: DetermineParentDocumentType = {
  ...SMART_PARENT,
  templateId: TemplateIdEnum.ROL_QUESTIONS,
};

const UPLOADED_PARENT: DetermineParentDocumentType = {
  isSmartDokument: false,
  type: DocumentTypeEnum.UPLOADED,
};

const BASE_ATTACHMENT: Omit<AttachmentAccessDocument, 'type' | 'isSmartDokument'> = {
  creatorRole: CreatorRole.KABAL_SAKSBEHANDLING,
};

const UPLOADED_ATTACHMENT: AttachmentAccessDocument = {
  ...BASE_ATTACHMENT,
  type: DocumentTypeEnum.UPLOADED,
  isSmartDokument: false,
};

const JOURNALFOERT_ATTACHMENT: AttachmentAccessDocument = {
  ...BASE_ATTACHMENT,
  type: DocumentTypeEnum.JOURNALFOERT,
  isSmartDokument: false,
};

const JOURNALFOERT_ROL_ATTACHMENT: AttachmentAccessDocument = {
  ...JOURNALFOERT_ATTACHMENT,
};

const ROL_ANSWERS: AttachmentAccessDocument = {
  ...BASE_ATTACHMENT,
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: DocumentTypeEnum.SMART,
  creatorRole: CreatorRole.KABAL_ROL,
  isSmartDokument: true,
};

const BASE_PARAMS: DocumentAccessParams = {
  isCaseFinished: false,
  isCaseTildelt: () => false,
  isSaksbehandlerUser: false,
  isTildeltSaksbehandler: () => false,
  isMedunderskriver: () => false,
  isSentToMedunderskriver: () => false,
  isRolUser: false,
  isAssignedRol: false,
  isSentToRol: false,
  isReturnedFromRol: () => false,
};

const UNSET_ERROR = expect.stringContaining('fordi tilgangen ikke er satt opp riktig. Kontakt Team Klage.');
const NOT_SUPPORTED_ERROR = expect.stringContaining('skal ikke være mulig. Kontakt Team Klage.');

describe('Attachment access', () => {
  describe('Unassigned cases', () => {
    describe('Unassigned saksbehandler', () => {
      describe('Uploaded attachment', () => {
        it('should allow full access', () => {
          const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
            ...BASE_PARAMS,
            isSaksbehandlerUser: true,
          });

          expect(access).toEqual({
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.RENAME]: UNSET_ERROR,
            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
          });
        });
      });

      describe('Smart document attachment', () => {
        it('should allow full access to journalført attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
            ...BASE_PARAMS,
            isSaksbehandlerUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.NOT_ASSIGNED,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.NOT_ASSIGNED,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });
      });

      describe('ROL questions attachment', () => {
        it('should allow read-only access to saksbehandler attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isSaksbehandlerUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.NOT_ASSIGNED,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.NOT_ASSIGNED,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });

        it('should allow read-only access to ROL attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isSaksbehandlerUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });

        it('should allow read-only access to ROL answers', () => {
          const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isSaksbehandlerUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: UNSET_ERROR,
          });
        });
      });
    });

    describe('ROL users', () => {
      describe('Uploaded attachment', () => {
        it('should allow read-only access', () => {
          const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.NOT_ASSIGNED,
            // rename: AttachmentAccessEnum.NOT_ASSIGNED,
            // move: AttachmentAccessEnum.NOT_ASSIGNED,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: UNSET_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });
      });

      describe('Smart document attachment', () => {
        it('should allow read-only access to journalført attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.NOT_ASSIGNED,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.NOT_ASSIGNED,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });
      });

      describe('ROL questions attachment', () => {
        it('should allow read-only access to saksbehandler attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.NOT_ASSIGNED,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.NOT_ASSIGNED,
            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });

        it('should allow read-only access to ROL attachment', () => {
          const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.NOT_SUPPORTED,
            // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // rename: AttachmentAccessEnum.NOT_SUPPORTED,
            // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
          });
        });

        it('should allow read-only access to ROL answers', () => {
          const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
            ...BASE_PARAMS,
            isRolUser: true,
          });

          expect(access).toEqual({
            // read: true,
            // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
            // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,

            [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.REMOVE]: UNSET_ERROR,
            [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
            [DuaActionEnum.WRITE]: UNSET_ERROR,
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
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,

              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: UNSET_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: UNSET_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow full access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: UNSET_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: UNSET_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: UNSET_ERROR,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_ASSIGNED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: UNSET_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: UNSET_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // rename: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: UNSET_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: UNSET_ERROR,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: UNSET_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });
    });

    describe('With medunderskriver', () => {
      describe('Assigned saksbehandler', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_ASSIGNED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToMedunderskriver: () => true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });
    });

    describe('With ROL', () => {
      describe('Assigned saksbehandler', () => {
        describe('Uploaded attachment', () => {
          it('should allow full access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow full access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow full access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.SENT_TO_ROL,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.SENT_TO_ROL,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isTildeltSaksbehandler: () => true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });

      describe('Assigned ROL', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_ASSIGNED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow full access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow full access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isAssignedRol: true,
              isRolUser: true,
              isSentToRol: true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ALLOWED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        describe('Uploaded attachment', () => {
          it('should allow read-only access', () => {
            const access = getAttachmentAccessMap(UPLOADED_ATTACHMENT, UPLOADED_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ALLOWED,
              // rename: AttachmentAccessEnum.ALLOWED,
              // move: AttachmentAccessEnum.ALLOWED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('Smart document attachment', () => {
          it('should allow read-only access to journalført attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, SMART_PARENT, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });

        describe('ROL questions attachment', () => {
          it('should allow read-only access to saksbehandler attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.NOT_ASSIGNED,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.NOT_ASSIGNED,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL attachment', () => {
            const access = getAttachmentAccessMap(JOURNALFOERT_ROL_ATTACHMENT, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.NOT_SUPPORTED,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.NOT_SUPPORTED,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });

          it('should allow read-only access to ROL answers', () => {
            const access = getAttachmentAccessMap(ROL_ANSWERS, ROL_QUESTIONS, {
              ...BASE_PARAMS,
              isCaseTildelt: () => true,
              isSentToRol: true,
              isMedunderskriver: () => true,
            });

            expect(access).toEqual({
              // read: true,
              // write: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // rename: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              // move: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
              [DuaActionEnum.CHANGE_TYPE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.CREATE]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.FINISH]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.REMOVE]: UNSET_ERROR,
              [DuaActionEnum.RENAME]: NOT_SUPPORTED_ERROR,
              [DuaActionEnum.WRITE]: NOT_SUPPORTED_ERROR,
            });
          });
        });
      });
    });
  });
});
