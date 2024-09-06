import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContextElement } from '@app/components/documents/drag-context';
import { Fields, SIZES } from '@app/components/documents/journalfoerte-documents/grid';
import { ToggleExpandedButton } from '@app/components/documents/toggle-expand-button';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsWidth } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { JournalfoerteDocuments } from './journalfoerte-documents/journalfoerte-documents';
import { NewDocuments } from './new-documents/new-documents';
import { UploadFile } from './upload-file/upload-file';

const MIN_WIDTH = 550;

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
      75 +
      Object.values(columns).reduce((acc, v) => (v ? acc + 8 : acc), 0) +
      SIZES[Fields.SelectRow][0] +
      SIZES[Fields.Title][0] +
      SIZES[Fields.Action][0] +
      SIZES[Fields.ToggleVedlegg][0] +
      SIZES[Fields.ResetFilters][0] +
      (columns.AVSENDER_MOTTAKER ? SIZES[Fields.AvsenderMottaker][0] : 0) +
      (columns.DATO_OPPRETTET ? SIZES[Fields.DatoOpprettet][0] : 0) +
      (columns.DATO_REG_SENDT ? SIZES[Fields.DatoRegSendt][0] : 0) +
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
      <Container style={{ minWidth }} ref={ref}>
        <DocumentsHeader>
          <Heading size="medium" level="1">
            Dokumenter
          </Heading>
          <ButtonContainer>
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
          </ButtonContainer>
          <UploadFile />
          <ToggleExpandedButton />
        </DocumentsHeader>

        <NewDocuments />

        <JournalfoerteDocuments />
      </Container>
    </DragAndDropContextElement>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  position: relative;
  resize: horizontal;
`;

const DocumentsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  column-gap: var(--a-spacing-2);
  position: relative;
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-bottom: var(--a-spacing-2);
  padding-top: var(--a-spacing-2);
  border-bottom: 1px solid var(--a-border-divider);
  margin-bottom: var(--a-spacing-2);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
