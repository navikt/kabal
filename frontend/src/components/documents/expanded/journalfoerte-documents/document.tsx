import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { SelectContext } from '@app/components/documents/expanded/journalfoerte-documents/select-context/select-context';
import { SelectRow } from '@app/components/documents/expanded/journalfoerte-documents/select-row';
import { isoDateToPretty } from '@app/domain/date';
import { findDocument } from '@app/domain/find-document';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsFilterSaksId, useDocumentsFilterTema } from '@app/hooks/settings/use-setting';
import { useFullTemaNameFromId } from '@app/hooks/use-kodeverk-ids';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';
import { StyledDate, StyledJournalfoertDocument } from '../styled-components/document';
import { ClickableField, Fields, StyledClickableField } from '../styled-components/grid';
import { AttachmentList } from './attachment-list';
import { AvsenderMottaker } from './avsender-mottaker';
import { DocumentTitle } from './document-title';
import { ExpandedDocument } from './expanded-document';
import { IncludeDocument } from './include-document';
import { JournalposttypeTag } from './journalposttype';
import { DocumentTema } from './styled-components';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Document = memo(
  ({ document, isSelected }: Props) => {
    const oppgaveId = useOppgaveId();
    const [expanded, setExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const { setValue: setSaksId } = useDocumentsFilterSaksId();
    const { setValue: setTema } = useDocumentsFilterTema();
    const { selectedDocuments } = useContext(SelectContext);

    const cleanDragUI = useRef<() => void>(() => undefined);

    const { data } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);
    const documents = data?.dokumenter ?? EMPTY_ARRAY;

    const {
      dokumentInfoId,
      journalpostId,
      tittel,
      registrert,
      harTilgangTilArkivvariant,
      tema,
      valgt,
      avsenderMottaker,
      sak,
      journalposttype,
    } = document;

    const temaName = useFullTemaNameFromId(tema);

    const toggleExpanded = () => setExpanded(!expanded);
    const Icon = expanded ? ChevronUpIcon : ChevronDownIcon;

    const prettyDate = useMemo(() => isoDateToPretty(registrert), [registrert]);

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.dataTransfer.clearData();

        const docs = isSelected
          ? Object.values(selectedDocuments)
              .map((s) => findDocument(s.dokumentInfoId, documents))
              .filter(isNotUndefined)
          : [document];

        if (docs.length === 0) {
          return;
        }

        cleanDragUI.current = createDragUI(
          docs.map((d) => d.tittel ?? ''),
          e
        );

        e.dataTransfer.effectAllowed = 'link';
        e.dataTransfer.dropEffect = 'link';
        e.dataTransfer.setData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT, JSON.stringify(docs));
      },
      [document, documents, isSelected, selectedDocuments]
    );

    return (
      <>
        <StyledJournalfoertDocument
          $expanded={expanded}
          $selected={isSelected}
          data-testid="document-journalfoert"
          data-journalpostid={journalpostId}
          data-dokumentinfoid={dokumentInfoId}
          data-documentname={tittel}
          onDragStart={onDragStart}
          onDragEnd={() => {
            setIsDragging(false);
            cleanDragUI.current();
          }}
          draggable={!isDragging}
        >
          <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} />
          <ExpandButton variant="tertiary" size="small" icon={<Icon aria-hidden />} onClick={toggleExpanded} />
          <DocumentTitle
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel ?? ''}
          />
          <DocumentTema
            as={StyledClickableField}
            $area={Fields.Meta}
            size="small"
            variant="tertiary"
            onClick={() => setTema([tema ?? 'UNKNOWN'])}
            title={temaName}
          >
            {temaName}
          </DocumentTema>
          <StyledDate dateTime={registrert}>{prettyDate}</StyledDate>
          <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
          <ClickableField $area={Fields.SaksId} onClick={() => setSaksId([sak?.fagsakId ?? 'NONE'])}>
            {sak?.fagsakId ?? 'Ingen'}
          </ClickableField>
          <JournalposttypeTag type={journalposttype} />
          <IncludeDocument
            dokumentInfoId={dokumentInfoId}
            journalpostId={journalpostId}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            name={tittel ?? ''}
            oppgavebehandlingId={oppgaveId}
            checked={valgt}
          />
        </StyledJournalfoertDocument>
        <ExpandedDocument show={expanded} document={document} />
        <AttachmentList document={document} oppgaveId={oppgaveId} />
      </>
    );
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.document.valgt === nextProps.document.valgt &&
      prevProps.document.tittel === nextProps.document.tittel &&
      prevProps.document.vedlegg.length === nextProps.document.vedlegg.length &&
      prevProps.document.vedlegg.every((v, i) => {
        const n = nextProps.document.vedlegg[i];

        if (n === undefined) {
          return false;
        }

        return v.valgt === n.valgt && v.tittel === n.tittel && v.dokumentInfoId === n.dokumentInfoId;
      });

    return propsAreEqual;
  }
);

Document.displayName = 'Document';

const ExpandButton = styled(Button)`
  grid-area: expand;
`;
