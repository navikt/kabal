import { DragAndDropContextElement } from '@app/components/documents/drag-context';
import { Fields, SIZES } from '@app/components/documents/journalfoerte-documents/grid';
import { ToggleExpandedButton } from '@app/components/documents/toggle-expand-button';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsWidth } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { JournalfoerteDocuments } from './journalfoerte-documents/journalfoerte-documents';
import { NewDocuments } from './new-documents/new-documents-list/new-documents';
import { UploadFile } from './upload-file/upload-file';

const MIN_WIDTH = 570;
const HEADING_ID = 'dokumenter-heading';

export const ExpandedDocuments = () => {
  const [isExpanded] = useIsExpanded();
  const { value: width = 800, setValue: setDocumentsWidth } = useDocumentsWidth();
  const { columns } = useArchivedDocumentsColumns();
  const ref = useRef<HTMLDivElement>(null);

  const minWidth = useMemo(() => {
    if (!isExpanded) {
      return MIN_WIDTH;
    }

    const _minWidth =
      125 +
      Object.values(columns).reduce((acc, v) => (v ? acc + 8 : acc), 0) +
      SIZES[Fields.Select][0] +
      SIZES[Fields.ToggleVedlegg][0] +
      SIZES[Fields.Title][0] +
      SIZES[Fields.Action][0] +
      (columns.AVSENDER_MOTTAKER ? SIZES[Fields.AvsenderMottaker][0] : 0) +
      (columns.DATO_OPPRETTET ? SIZES[Fields.DatoOpprettet][0] : 0) +
      (columns.DATO_SORTERING ? SIZES[Fields.DatoSortering][0] : 0) +
      (columns.SAKSNUMMER ? SIZES[Fields.Saksnummer][0] : 0) +
      (columns.TEMA ? SIZES[Fields.Tema][0] : 0) +
      (columns.TYPE ? SIZES[Fields.Type][0] : 0);

    return Math.max(_minWidth, MIN_WIDTH);
  }, [columns, isExpanded]);

  // Prevent ResizeObserver from reinitializing on every resize and change.
  const minWidthRef = useRef(minWidth);
  const setRef = useRef(setDocumentsWidth);

  useEffect(() => {
    setRef.current = setDocumentsWidth;
    minWidthRef.current = minWidth;
  }, [minWidth, setDocumentsWidth]);

  // Observe the width of the container and save it to settings.
  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    let firstRun = true;
    let timeout: Timer | null = null;

    const observer = new ResizeObserver(() => {
      const newWidth = ref.current?.clientWidth ?? minWidthRef.current;
      setRef.current(newWidth);
      const _width = newWidth.toString(10);

      if (firstRun) {
        firstRun = false;

        return pushEvent('initial-documents-panel-size', 'documents', { width: _width });
      }

      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => pushEvent('set-documents-panel-size', 'documents', { width: _width }), 5000);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const setWidth = useCallback((w: number) => {
    if (ref.current !== null) {
      ref.current.style.width = `${w}px`;
    }
  }, []);

  // Set initial width from saved settings.
  useEffect(() => {
    if (ref.current !== null && ref.current.style.width === '') {
      setWidth(width);
    }
  }, [setWidth, width]);

  // Set width to minimum when collapsed.
  useEffect(() => {
    if (!isExpanded) {
      setWidth(minWidth);
    }
  }, [isExpanded, minWidth, setWidth]);

  return (
    <DragAndDropContextElement>
      <VStack
        as="section"
        width="auto"
        height="100%"
        overflowY="hidden"
        overflowX="auto"
        position="relative"
        minWidth={`${minWidth}px`}
        className="resize-x"
        ref={ref}
        aria-labelledby={HEADING_ID}
      >
        <HStack asChild align="start" justify="start" gap="0 2" position="relative">
          <Box
            as="header"
            borderWidth="0 0 1 0"
            borderColor="border-divider"
            paddingInline="4"
            paddingBlock="2"
            marginBlock="0 2"
            aria-labelledby={HEADING_ID}
          >
            <Heading size="medium" level="1" id={HEADING_ID}>
              Dokumenter
            </Heading>

            <HStack align="center" height="100%">
              <Button
                variant="tertiary-neutral"
                size="xsmall"
                icon={<MinusIcon aria-hidden />}
                onClick={() => setWidth(Math.max(minWidth, width - 50))}
                disabled={width <= minWidth}
                title="Forminsk dokumenter"
              />

              <Button
                variant="tertiary-neutral"
                size="xsmall"
                icon={<PlusIcon aria-hidden />}
                onClick={() => setWidth(width + 50)}
                title="Forstørr dokumenter"
              />
            </HStack>

            <UploadFile />

            <ToggleExpandedButton />
          </Box>
        </HStack>

        <NewDocuments />

        <JournalfoerteDocuments />
      </VStack>
    </DragAndDropContextElement>
  );
};
