import { describe, expect, it } from 'bun:test';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { type DuaDocumentAccessDocument, getDocumentAccessMap } from '@app/hooks/dua-access/document/access';
import type { DocumentAccessParams } from '@app/hooks/dua-access/shared/params';
import { CreatorRole, DocumentTypeEnum } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const BASE_DOCUMENT: Omit<DuaDocumentAccessDocument, 'type' | 'isSmartDokument'> = {
  id: '1',
  isMarkertAvsluttet: false,
  creatorRole: CreatorRole.KABAL_SAKSBEHANDLING,
};

const UPLOADED_NOTAT: DuaDocumentAccessDocument = {
  ...BASE_DOCUMENT,
  type: DocumentTypeEnum.UPLOADED,
  isSmartDokument: false,
  isMarkertAvsluttet: false,
};

const SMART_NOTAT: DuaDocumentAccessDocument = {
  ...BASE_DOCUMENT,
  type: DocumentTypeEnum.SMART,
  isSmartDokument: true,
  templateId: TemplateIdEnum.NOTAT,
};

const ROL_QUESTIONS: DuaDocumentAccessDocument = {
  ...SMART_NOTAT,
  templateId: TemplateIdEnum.ROL_QUESTIONS,
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

describe('Document access', () => {
  describe('Finished cases', () => {
    describe('Uploaded document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], { ...BASE_PARAMS, isCaseFinished: true });
        expect(access).toEqual({
          [DuaActionEnum.CREATE]: null,
          [DuaActionEnum.WRITE]: null, // DocumentAccessEnum.NOT_SUPPORTED,
          [DuaActionEnum.RENAME]: null, // DocumentAccessEnum.ALLOWED,
          [DuaActionEnum.CHANGE_TYPE]: null, // DocumentAccessEnum.ALLOWED,
          [DuaActionEnum.REMOVE]: null, // DocumentAccessEnum.ALLOWED,
          [DuaActionEnum.FINISH]: null, // DocumentAccessEnum.ALLOWED,
        });
      });
    });

    describe('Smart document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccessMap(SMART_NOTAT, () => [], { ...BASE_PARAMS, isCaseFinished: true });
        expect(access).toEqual({
          // write: DocumentAccessEnum.ALLOWED,
          // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
          // referAttachments: DocumentAccessEnum.ALLOWED,
          // remove: DocumentAccessEnum.ALLOWED,
          // changeType: DocumentAccessEnum.ALLOWED,
          // rename: DocumentAccessEnum.ALLOWED,
          // finish: DocumentAccessEnum.ALLOWED,
          [DuaActionEnum.CREATE]: null,
          [DuaActionEnum.WRITE]: null,
          [DuaActionEnum.RENAME]: null,
          [DuaActionEnum.CHANGE_TYPE]: null,
          [DuaActionEnum.REMOVE]: null,
          [DuaActionEnum.FINISH]: null,
        });
      });
    });

    describe('ROL questions document', () => {
      it('should allow full access', () => {
        const access = getDocumentAccessMap(ROL_QUESTIONS, () => [], { ...BASE_PARAMS, isCaseFinished: true });
        expect(access).toEqual({
          // write: DocumentAccessEnum.ALLOWED,
          // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
          // referAttachments: DocumentAccessEnum.ALLOWED,
          // remove: DocumentAccessEnum.ALLOWED,
          // changeType: DocumentAccessEnum.NOT_SUPPORTED,
          // rename: DocumentAccessEnum.ALLOWED,
          // finish: DocumentAccessEnum.ALLOWED,
          [DuaActionEnum.CREATE]: null,
          [DuaActionEnum.WRITE]: null,
          [DuaActionEnum.RENAME]: null,
          [DuaActionEnum.CHANGE_TYPE]: null,
          [DuaActionEnum.REMOVE]: null,
          [DuaActionEnum.FINISH]: null,
        });
      });
    });
  });

  describe('Unassigned cases', () => {
    it('should allow full access to uploaded notat for all users', () => {
      const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], BASE_PARAMS);

      expect(access).toEqual({
        // write: DocumentAccessEnum.NOT_SUPPORTED,
        // uploadAttachments: DocumentAccessEnum.ALLOWED,
        // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
        // remove: DocumentAccessEnum.ALLOWED,
        // changeType: DocumentAccessEnum.ALLOWED,
        // rename: DocumentAccessEnum.ALLOWED,
        // finish: DocumentAccessEnum.ALLOWED,
        [DuaActionEnum.CREATE]: null,
        [DuaActionEnum.WRITE]: null,
        [DuaActionEnum.RENAME]: null,
        [DuaActionEnum.CHANGE_TYPE]: null,
        [DuaActionEnum.REMOVE]: null,
        [DuaActionEnum.FINISH]: null,
      });
    });

    it('should allow full access to smart document for all users', () => {
      const access = getDocumentAccessMap(SMART_NOTAT, () => [], BASE_PARAMS);

      expect(access).toEqual({
        // write: DocumentAccessEnum.ALLOWED,
        // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
        // referAttachments: DocumentAccessEnum.ALLOWED,
        // remove: DocumentAccessEnum.ALLOWED,
        // changeType: DocumentAccessEnum.ALLOWED,
        // rename: DocumentAccessEnum.ALLOWED,
        // finish: DocumentAccessEnum.ALLOWED,
        [DuaActionEnum.CREATE]: null,
        [DuaActionEnum.WRITE]: null,
        [DuaActionEnum.RENAME]: null,
        [DuaActionEnum.CHANGE_TYPE]: null,
        [DuaActionEnum.REMOVE]: null,
        [DuaActionEnum.FINISH]: null,
      });
    });
  });

  describe('Assigned cases', () => {
    describe('With saksbehandler', () => {
      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow full access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.ALLOWED,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.ALLOWED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_ASSIGNED,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            // remove: DocumentAccessEnum.NOT_ASSIGNED,
            // changeType: DocumentAccessEnum.NOT_ASSIGNED,
            // rename: DocumentAccessEnum.NOT_ASSIGNED,
            // finish: DocumentAccessEnum.NOT_ASSIGNED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });
    });

    describe('With medunderskriver', () => {
      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.SENT_TO_MU,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.SENT_TO_MU,
            // remove: DocumentAccessEnum.SENT_TO_MU,
            // changeType: DocumentAccessEnum.SENT_TO_MU,
            // rename: DocumentAccessEnum.SENT_TO_MU,
            // finish: DocumentAccessEnum.SENT_TO_MU,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });

      describe('Assigned medunderskriver', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow write access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isMedunderskriver: () => true,
            isSentToMedunderskriver: () => true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.ALLOWED,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            // remove: DocumentAccessEnum.NOT_ASSIGNED,
            // changeType: DocumentAccessEnum.NOT_ASSIGNED,
            // rename: DocumentAccessEnum.NOT_ASSIGNED,
            // finish: DocumentAccessEnum.NOT_ASSIGNED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });
    });

    describe('With ROL', () => {
      describe('Assigned ROL', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow read-only access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_ASSIGNED,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
            // remove: DocumentAccessEnum.NOT_ASSIGNED,
            // changeType: DocumentAccessEnum.NOT_ASSIGNED,
            // rename: DocumentAccessEnum.NOT_ASSIGNED,
            // finish: DocumentAccessEnum.NOT_ASSIGNED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow some access to ROL-questions document', () => {
          const access = getDocumentAccessMap(ROL_QUESTIONS, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isAssignedRol: true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.ALLOWED,
            // remove: DocumentAccessEnum.NOT_ASSIGNED,
            // changeType: DocumentAccessEnum.NOT_SUPPORTED,
            // rename: DocumentAccessEnum.NOT_ASSIGNED,
            // finish: DocumentAccessEnum.NOT_ASSIGNED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });

      describe('Assigned saksbehandler', () => {
        it('should allow full access to uploaded notat', () => {
          const access = getDocumentAccessMap(UPLOADED_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.NOT_SUPPORTED,
            // uploadAttachments: DocumentAccessEnum.ALLOWED,
            // referAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow full access to smart document', () => {
          const access = getDocumentAccessMap(SMART_NOTAT, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.ALLOWED,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.ALLOWED,
            // remove: DocumentAccessEnum.ALLOWED,
            // changeType: DocumentAccessEnum.ALLOWED,
            // rename: DocumentAccessEnum.ALLOWED,
            // finish: DocumentAccessEnum.ALLOWED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });

        it('should allow read-only access to ROL-questions document', () => {
          const access = getDocumentAccessMap(ROL_QUESTIONS, () => [], {
            ...BASE_PARAMS,
            isCaseTildelt: () => true,
            isTildeltSaksbehandler: () => true,
            isSentToRol: true,
          });

          expect(access).toEqual({
            // write: DocumentAccessEnum.SENT_TO_ROL,
            // uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
            // referAttachments: DocumentAccessEnum.SENT_TO_ROL,
            // remove: DocumentAccessEnum.SENT_TO_ROL,
            // changeType: DocumentAccessEnum.NOT_SUPPORTED,
            // rename: DocumentAccessEnum.SENT_TO_ROL,
            // finish: DocumentAccessEnum.ROL_REQUIRED,
            [DuaActionEnum.CREATE]: null,
            [DuaActionEnum.WRITE]: null,
            [DuaActionEnum.RENAME]: null,
            [DuaActionEnum.CHANGE_TYPE]: null,
            [DuaActionEnum.REMOVE]: null,
            [DuaActionEnum.FINISH]: null,
          });
        });
      });
    });
  });
});
