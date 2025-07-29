import { NewDocumentsHeader } from '@app/components/documents/new-documents/header/header';
import { ModalContextElement } from '@app/components/documents/new-documents/modal/modal-context';
import { ROW_HEIGHT } from '@app/components/documents/new-documents/new-documents-list/constants';
import { useDocumentNodes } from '@app/components/documents/new-documents/new-documents-list/document-nodes';
import { getListHeight } from '@app/components/documents/new-documents/new-documents-list/list-height';
import { useDocumentMap } from '@app/components/documents/new-documents/new-documents-list/use-document-map';
import { clamp } from '@app/functions/clamp';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasUploadAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Alert, HStack, Loader, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyledDocumentList } from '../../styled-components/document-list';

/** Number of rows to render above and below the rendered window. */
const SCROLL_BUFFER_ROWS = 5;

export const NewDocuments = () => {
  const oppgaveId = useOppgaveId();
  const hasUploadAccess = useHasUploadAccess();
  const isFeilregistrert = useIsFeilregistrert();
  const { isSuccess, isError } = useGetDocumentsQuery(oppgaveId);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [_scrollTop, _setScrollTop] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const isAssignedRolAndSent = useIsAssignedRolAndSent();

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

  const documentMap = useDocumentMap();
  const listHeight = getListHeight(documentMap, isAssignedRolAndSent, isFeilregistrert, hasUploadAccess);

  const [absoluteStartIndex, absoluteEndIndex] = useMemo<[number, number]>(() => {
    const rowsToRender = containerHeight === 0 ? 0 : Math.ceil(containerHeight / ROW_HEIGHT);
    const unbufferedStart = scrollTop === 0 ? 0 : Math.max(0, Math.floor(scrollTop / ROW_HEIGHT));
    const _absoluteStartIndex = Math.max(0, unbufferedStart - SCROLL_BUFFER_ROWS);
    const _absoluteEndIndex = unbufferedStart + rowsToRender + SCROLL_BUFFER_ROWS;

    return [_absoluteStartIndex, _absoluteEndIndex];
  }, [containerHeight, scrollTop]);

  const documentNodes = useDocumentNodes(
    documentMap,
    absoluteStartIndex,
    absoluteEndIndex,
    isAssignedRolAndSent,
    isFeilregistrert,
    hasUploadAccess,
  );

  const onRef = useCallback((ref: HTMLDivElement | null) => {
    setContainerHeight(ref?.clientHeight ?? 0);
    setContainerRef(ref);
  }, []);

  if (isError) {
    return (
      <Wrapper>
        <HStack height="12" align="center" padding="2">
          <Alert variant="error" inline>
            Kunne ikke hente dokumenter
          </Alert>
        </HStack>
      </Wrapper>
    );
  }

  if (!isSuccess) {
    return (
      <Wrapper>
        <HStack height="12" align="center" padding="2">
          <Loader size="xlarge" />
        </HStack>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ModalContextElement>
        <div
          ref={onRef}
          className="grow overflow-y-auto"
          onScroll={({ currentTarget }) => {
            const clamped = clamp(currentTarget.scrollTop, 0, currentTarget.scrollHeight - currentTarget.clientHeight); // Elastic scrolling in Safari can exceed the boundaries.
            _setScrollTop(clamped);
          }}
        >
          {documentMap.size === 0 ? (
            <HStack height="12" align="center" paddingInline="2">
              <Alert variant="info" inline>
                Ingen dokumenter
              </Alert>
            </HStack>
          ) : (
            <StyledDocumentList
              data-testid="new-documents-list"
              className="relative overflow-y-hidden"
              style={{ height: listHeight }}
              aria-setsize={documentMap.size}
            >
              {documentNodes}
            </StyledDocumentList>
          )}
        </div>
      </ModalContextElement>
    </Wrapper>
  );
};

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => (
  <VStack
    as="section"
    paddingInline="4"
    paddingBlock="0"
    height="fit-content"
    maxHeight="calc(50% - 200px)"
    data-testid="new-documents-section"
    aria-labelledby="dua-heading"
    className="border-ax-border-neutral border-b-1"
  >
    <NewDocumentsHeader headingId="dua-heading" />

    {children}
  </VStack>
);
