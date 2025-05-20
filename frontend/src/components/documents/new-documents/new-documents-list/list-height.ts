import {
  PADDING_BOTTOM,
  PADDING_TOP,
  ROW_HEIGHT,
  SEPARATOR_HEIGHT,
  UPLOAD_OR_ROL_ANSWERS_BUTTON_HEIGHT,
} from '@app/components/documents/new-documents/new-documents-list/constants';
import type { DocumentWithAttachments } from '@app/components/documents/new-documents/new-documents-list/types';
import { getHasUploadOrRolAnswersButton } from '@app/components/documents/new-documents/new-documents-list/upload-button';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';

export const getListHeight = (
  documentMap: Map<string, DocumentWithAttachments>,
  isAssignedRolAndSent: boolean,
  isFeilregistrert: boolean,
  hasUploadAccess: boolean,
) => {
  let h = PADDING_TOP + PADDING_BOTTOM;

  for (const { mainDocument, journalfoerteDocuments, pdfOrSmartDocuments } of documentMap.values()) {
    const hasUploadOrRolAnswersButton = getHasUploadOrRolAnswersButton(
      mainDocument,
      isAssignedRolAndSent,
      isFeilregistrert,
      hasUploadAccess,
    );
    const pdfLength = pdfOrSmartDocuments.length;
    const journalfoertLength = journalfoerteDocuments.length;
    const hasSeparator = pdfLength !== 0 && journalfoertLength !== 0;
    const hasAttachments = pdfLength !== 0 || journalfoertLength !== 0;
    const hasOverview = !getIsIncomingDocument(mainDocument?.dokumentTypeId) && hasAttachments;

    h += hasUploadOrRolAnswersButton ? UPLOAD_OR_ROL_ANSWERS_BUTTON_HEIGHT : 0;
    h += hasOverview ? ROW_HEIGHT : 0;
    h += pdfLength * ROW_HEIGHT;
    h += hasSeparator ? SEPARATOR_HEIGHT : 0;
    h += journalfoertLength * ROW_HEIGHT;
    h += ROW_HEIGHT;
  }

  return h;
};
