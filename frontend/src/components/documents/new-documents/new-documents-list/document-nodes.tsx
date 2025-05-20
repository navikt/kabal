import {
  PADDING_TOP,
  ROW_HEIGHT,
  SEPARATOR_HEIGHT,
  UPLOAD_OR_ROL_ANSWERS_BUTTON_HEIGHT,
} from '@app/components/documents/new-documents/new-documents-list/constants';
import type { DocumentWithAttachments } from '@app/components/documents/new-documents/new-documents-list/types';
import { getHasUploadOrRolAnswersButton } from '@app/components/documents/new-documents/new-documents-list/upload-button';
import { NewParentDocument } from '@app/components/documents/new-documents/new-parent-document';
import { clamp } from '@app/functions/clamp';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';

export const useDocumentNodes = (
  documentMap: Map<string, DocumentWithAttachments>,
  absoluteStartIndex: number,
  absoluteEndIndex: number,
  isAssignedRolAndSent: boolean,
  isFeilregistrert: boolean,
  hasUploadAccess: boolean,
) => {
  const _documentNodes = new Array<React.ReactNode>(documentMap.size);

  const list = [...documentMap.values()].sort((a, b) => {
    if (a.mainDocument === undefined || b.mainDocument === undefined) {
      return 0;
    }

    return b.mainDocument.created.localeCompare(a.mainDocument.created);
  });

  let absoluteIndex = 0;
  let offsetPx = PADDING_TOP;
  let overviewCount = 0;

  for (let i = 0; i < documentMap.size; i++) {
    const listItem = list[i];

    if (listItem === undefined) {
      continue;
    }

    const { mainDocument, pdfOrSmartDocuments, journalfoerteDocuments } = listItem;

    if (mainDocument === undefined) {
      continue;
    }

    const pdfLength = pdfOrSmartDocuments.length;
    const journalfoertLength = journalfoerteDocuments.length;
    const vedleggCount = pdfLength + journalfoertLength;
    const hasAttachments = vedleggCount !== 0;

    const overview = !getIsIncomingDocument(mainDocument.dokumentTypeId) && hasAttachments ? 1 : 0;
    const hasSeparator = pdfLength !== 0 && journalfoertLength !== 0;
    const separatorCount = hasSeparator ? 1 : 0;

    const hasUploadOrRolAnswersButton = getHasUploadOrRolAnswersButton(
      mainDocument,
      isAssignedRolAndSent,
      isFeilregistrert,
      hasUploadAccess,
    );
    const uploadButtonCount = hasUploadOrRolAnswersButton ? 1 : 0;

    const virtualRows = overview + separatorCount + uploadButtonCount;

    const currentAbsoluteIndex = absoluteIndex + 1;

    const start = absoluteStartIndex - currentAbsoluteIndex - virtualRows - overviewCount;
    const end = absoluteEndIndex - currentAbsoluteIndex - overviewCount;

    const pdfStart = clamp(start, 0, pdfLength);
    const pdfEnd = clamp(end, 0, pdfLength);

    const journalfoertStart = clamp(start - pdfLength, 0, journalfoertLength);
    const journalfoertEnd = clamp(end - pdfLength, 0, journalfoertLength);

    _documentNodes[i] = (
      <NewParentDocument
        document={mainDocument}
        pdfOrSmartDocuments={pdfOrSmartDocuments.slice(pdfStart, pdfEnd)}
        journalfoerteDocuments={journalfoerteDocuments.slice(journalfoertStart, journalfoertEnd)}
        key={mainDocument.id}
        style={{ top: offsetPx }}
        pdfLength={pdfLength}
        journalfoertLength={journalfoertLength}
        pdfStart={pdfStart}
        journalfoertStart={journalfoertStart}
        hasAttachments={hasAttachments}
        hasSeparator={hasSeparator}
      />
    );

    overviewCount += overview;
    absoluteIndex += 1 + pdfLength + journalfoertLength + overview;
    offsetPx +=
      ROW_HEIGHT +
      pdfLength * ROW_HEIGHT +
      journalfoertLength * ROW_HEIGHT +
      separatorCount * SEPARATOR_HEIGHT +
      uploadButtonCount * UPLOAD_OR_ROL_ANSWERS_BUTTON_HEIGHT +
      overview * ROW_HEIGHT;
  }

  return _documentNodes;
};
