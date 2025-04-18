import {
  PADDING_BOTTOM,
  PADDING_TOP,
  ROW_HEIGHT,
  SEPARATOR_HEIGHT,
  UPLOAD_BUTTON_HEIGHT,
} from '@app/components/documents/new-documents/constants';
import { ListHeader } from '@app/components/documents/new-documents/header/header';
import { ModalContextElement } from '@app/components/documents/new-documents/modal/modal-context';
import { commonStyles } from '@app/components/documents/styled-components/container';
import { clamp } from '@app/functions/clamp';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IFileDocument,
  type IMainDocument,
  type ISmartDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Loader } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { StyledDocumentList } from '../styled-components/document-list';
import { NewParentDocument } from './new-parent-document';

interface DocumentWithAttachments {
  mainDocument?: IMainDocument;
  pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[];
  journalfoerteDocuments: JournalfoertDokument[];
  containsRolAttachments: boolean;
}

/** Number of rows to render above and below the rendered window. */
const SCROLL_BUFFER_ROWS = 5;

export const NewDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [_scrollTop, _setScrollTop] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setScrollTop(_scrollTop));

    return () => cancelAnimationFrame(handle);
  }, [_scrollTop]);

  useEffect(() => {
    if (containerRef !== null) {
      const resizeObserver = new ResizeObserver(() => setContainerHeight(containerRef.clientHeight));
      resizeObserver.observe(containerRef);

      return () => resizeObserver.disconnect();
    }
  }, [containerRef]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const documentMap = useMemo(() => {
    const _documentMap: Map<string, DocumentWithAttachments> = new Map();

    if (data === undefined) {
      return _documentMap;
    }

    const { length } = data;

    for (let i = 0; i < length; i++) {
      const document = data[i];

      if (document === undefined) {
        continue;
      }

      if (document.parentId === null) {
        const existing = _documentMap.get(document.id);

        if (existing === undefined) {
          _documentMap.set(document.id, {
            mainDocument: document,
            pdfOrSmartDocuments: [],
            journalfoerteDocuments: [],
            containsRolAttachments: false,
          });
        } else if (existing.mainDocument === undefined) {
          existing.mainDocument = document;
        }
        continue;
      }

      // New attachment.
      const existing = _documentMap.get(document.parentId);
      const isJournalfoertDocument = document.type === DocumentTypeEnum.JOURNALFOERT;

      if (existing !== undefined) {
        // Known parent.
        if (isJournalfoertDocument) {
          existing.journalfoerteDocuments.push(document);
        } else {
          existing.pdfOrSmartDocuments.push(document);
        }
        existing.containsRolAttachments =
          existing.containsRolAttachments || document.creator.creatorRole === CreatorRole.KABAL_ROL;
        continue;
      }

      const containsRolAttachments = document.creator.creatorRole === CreatorRole.KABAL_ROL;
      // Unknown parent.
      _documentMap.set(
        document.parentId,
        isJournalfoertDocument
          ? { pdfOrSmartDocuments: [], journalfoerteDocuments: [document], containsRolAttachments }
          : { pdfOrSmartDocuments: [document], journalfoerteDocuments: [], containsRolAttachments },
      );
    }

    return _documentMap;
  }, [data]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const listHeight = useMemo(() => {
    if (data === undefined) {
      return 0;
    }

    let h = PADDING_TOP + PADDING_BOTTOM;

    for (const d of documentMap.values()) {
      const isIncomingDocument = getIsIncomingDocument(d.mainDocument);
      const hasUploadButton = d.mainDocument?.templateId === TemplateIdEnum.ROL_QUESTIONS || isIncomingDocument;
      const pdfLength = d.pdfOrSmartDocuments.length;
      const journalfoertLength = d.journalfoerteDocuments.length;
      const hasSeparator = pdfLength !== 0 && journalfoertLength !== 0;
      const hasAttachments = pdfLength !== 0 || journalfoertLength !== 0;
      const hasOverview = !isIncomingDocument && hasAttachments;

      h += hasUploadButton ? UPLOAD_BUTTON_HEIGHT : 0;
      h += hasOverview ? ROW_HEIGHT : 0;
      h += pdfLength * ROW_HEIGHT;
      h += hasSeparator ? SEPARATOR_HEIGHT : 0;
      h += journalfoertLength * ROW_HEIGHT;
      h += ROW_HEIGHT;
    }

    return h;
  }, [data, documentMap]);

  const [absoluteStartIndex, absoluteEndIndex] = useMemo<[number, number]>(() => {
    const rowsToRender = containerHeight === 0 ? 0 : Math.ceil(containerHeight / ROW_HEIGHT);
    const unbufferedStart = scrollTop === 0 ? 0 : Math.max(0, Math.floor(scrollTop / ROW_HEIGHT));
    const _absoluteStartIndex = Math.max(0, unbufferedStart - SCROLL_BUFFER_ROWS);
    const _absoluteEndIndex = unbufferedStart + rowsToRender + SCROLL_BUFFER_ROWS;

    return [_absoluteStartIndex, _absoluteEndIndex];
  }, [containerHeight, scrollTop]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const documentNodes = useMemo(() => {
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

      const { mainDocument, pdfOrSmartDocuments, journalfoerteDocuments, containsRolAttachments } = listItem;

      if (mainDocument === undefined) {
        continue;
      }

      const isIncomingDocument = getIsIncomingDocument(mainDocument);

      const pdfLength = pdfOrSmartDocuments.length;
      const journalfoertLength = journalfoerteDocuments.length;
      const vedleggCount = pdfLength + journalfoertLength;
      const hasAttachments = vedleggCount !== 0;

      const overview = !isIncomingDocument && hasAttachments ? 1 : 0;
      const hasSeparator = pdfLength !== 0 && journalfoertLength !== 0;
      const separatorCount = hasSeparator ? 1 : 0;

      const hasUploadButton = mainDocument.templateId === TemplateIdEnum.ROL_QUESTIONS || isIncomingDocument;
      const uploadButtonCount = hasUploadButton ? 1 : 0;

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
          containsRolAttachments={containsRolAttachments}
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
        uploadButtonCount * UPLOAD_BUTTON_HEIGHT +
        overview * ROW_HEIGHT;
    }

    return _documentNodes;
  }, [documentMap, absoluteEndIndex, absoluteStartIndex]);

  const onRef = useCallback((ref: HTMLDivElement | null) => {
    setContainerHeight(ref?.clientHeight ?? 0);
    setContainerRef(ref);
  }, []);

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  return (
    <StyledDocumentsContainer data-testid="new-documents-section">
      <ModalContextElement>
        <ListHeader />
        <div
          ref={onRef}
          className="overflow-y-auto border-border-divider border-b-1"
          onScroll={({ currentTarget }) => {
            const clamped = clamp(currentTarget.scrollTop, 0, currentTarget.scrollHeight - currentTarget.clientHeight); // Elastic scrolling in Safari can exceed the boundries.
            _setScrollTop(clamped);
          }}
        >
          <StyledDocumentList
            data-testid="new-documents-list"
            className="relative overflow-y-hidden"
            style={{ height: listHeight }}
            aria-rowcount={documentMap.size}
          >
            {documentNodes}
          </StyledDocumentList>
        </div>
      </ModalContextElement>
    </StyledDocumentsContainer>
  );
};

const StyledDocumentsContainer = styled.section`
  ${commonStyles}
  max-height: calc(50% - 100px);
`;
