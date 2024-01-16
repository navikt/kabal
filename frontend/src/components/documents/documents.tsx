import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContextElement } from '@app/components/documents/drag-context';
import { Fields, SIZES } from '@app/components/documents/journalfoerte-documents/grid';
import { TabContextElement } from '@app/components/documents/tab-context';
import { ToggleExpandedButton } from '@app/components/documents/toggle-expand-button';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsEnabled, useDocumentsWidth } from '@app/hooks/settings/use-setting';
import { JournalfoerteDocuments } from './journalfoerte-documents/journalfoerte-documents';
import { NewDocuments } from './new-documents/new-documents';
import { UploadFile } from './upload-file/upload-file';

export const Documents = () => {
  const { value: shown = true } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();

  if (!shown) {
    return null;
  }

  if (isLoading || typeof data === 'undefined') {
    return (
      <PanelContainer data-testid="documents-panel">
        <Loader size="xlarge" />
      </PanelContainer>
    );
  }

  return (
    <TabContextElement>
      <PanelContainer data-testid="documents-panel">
        <ExpandedDocuments />
      </PanelContainer>
      <ViewPDF />
    </TabContextElement>
  );
};

const ExpandedDocuments = () => {
  const [isExpanded] = useIsExpanded();
  const { value: width = 800, setValue: setDocumentsWidth } = useDocumentsWidth();
  const { columns } = useArchivedDocumentsColumns();
  const ref = useRef<HTMLDivElement>(null);

  const minWidth = useMemo(() => {
    if (!isExpanded) {
      return 475;
    }

    const _minWidth =
      75 +
      Object.values(columns).reduce((acc, v) => (v ? acc + 8 : acc), 0) +
      SIZES[Fields.SelectRow][0] +
      SIZES[Fields.Title][0] +
      SIZES[Fields.Action][0] +
      SIZES[Fields.Expand][0] +
      SIZES[Fields.ResetFilters][0] +
      (columns.AVSENDER_MOTTAKER ? SIZES[Fields.AvsenderMottaker][0] : 0) +
      (columns.DATO_OPPRETTET ? SIZES[Fields.DatoOpprettet][0] : 0) +
      (columns.DATO_REG_SENDT ? SIZES[Fields.DatoRegSendt][0] : 0) +
      (columns.SAKSNUMMER ? SIZES[Fields.Saksnummer][0] : 0) +
      (columns.TEMA ? SIZES[Fields.Tema][0] : 0) +
      (columns.TYPE ? SIZES[Fields.Type][0] : 0);

    return Math.max(_minWidth, 550);
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

    const observer = new ResizeObserver(() => setRef.current(ref.current?.clientWidth ?? minWidthRef.current));
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
  column-gap: 8px;
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-top: 8px;
  border-bottom: 1px solid #c6c2bf;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
