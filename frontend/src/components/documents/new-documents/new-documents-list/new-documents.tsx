import { HStack, InlineMessage, Loader, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NewDocumentsHeader } from '@/components/documents/new-documents/header/header';
import { ModalContextElement } from '@/components/documents/new-documents/modal/modal-context';
import { ROW_HEIGHT } from '@/components/documents/new-documents/new-documents-list/constants';
import { useDocumentNodes } from '@/components/documents/new-documents/new-documents-list/document-nodes';
import { getListHeight } from '@/components/documents/new-documents/new-documents-list/list-height';
import { useDocumentMap } from '@/components/documents/new-documents/new-documents-list/use-document-map';
import { StyledDocumentList } from '@/components/documents/styled-components/document-list';
import { clamp } from '@/functions/clamp';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useLazyDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@/hooks/use-is-rol';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';

/** Number of rows to render above and below the rendered window. */
const SCROLL_BUFFER_ROWS = 5;

export const NewDocuments = () => {
  const oppgaveId = useOppgaveId();
  const creatorRole = useCreatorRole();
  const getUploadAccessError = useLazyDuaAccess();
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
  const listHeight = getListHeight(
    documentMap,
    isAssignedRolAndSent,
    isFeilregistrert,
    getUploadAccessError,
    creatorRole,
  );

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
    getUploadAccessError,
    creatorRole,
    documentMap.size,
  );

  const onRef = useCallback((ref: HTMLDivElement | null) => {
    setContainerHeight(ref?.clientHeight ?? 0);
    setContainerRef(ref);
  }, []);

  if (isError) {
    return (
      <Wrapper>
        <HStack height="12" align="center" padding="space-8">
          <InlineMessage status="error">Kunne ikke hente dokumenter</InlineMessage>
        </HStack>
      </Wrapper>
    );
  }

  if (!isSuccess) {
    return (
      <Wrapper>
        <HStack height="12" align="center" padding="space-8">
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
            <HStack height="12" align="center" paddingInline="space-8">
              <InlineMessage status="info">Ingen dokumenter</InlineMessage>
            </HStack>
          ) : (
            <StyledDocumentList className="relative overflow-y-hidden" style={{ height: listHeight }}>
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
    paddingInline="space-16"
    paddingBlock="space-0"
    maxHeight="max(80px, calc(50% - 100px))"
    aria-labelledby="dua-heading"
    className="border-ax-border-neutral border-b"
  >
    <NewDocumentsHeader headingId="dua-heading" />

    {children}
  </VStack>
);
