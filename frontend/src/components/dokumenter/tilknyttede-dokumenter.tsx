import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_BASE_QUERY } from '../../redux-api/common';
import { useGetTilknyttedeDokumenterQuery } from '../../redux-api/oppgavebehandling';
import { IDocument, IDocumentVedlegg } from '../../types/documents';
import { IDocumentReference } from '../../types/oppgave-common';
import { ShownDocumentContext } from './context';
import { dokumentMatcher } from './helpers';
import {
  DokumenterMinivisning,
  StyledSubHeader,
  Tilknyttet,
  TilknyttetDato,
  TilknyttetKnapp,
} from './styled-components/minivisning';
import { TilknyttedeNyeDokumenter } from './tilknyttede-nye-dokumenter';
import { ITilknyttetDokument } from './types';

interface TilknyttedeDokumenterProps {
  tilknyttedeDokumenter: IDocumentReference[];
}

export const TilknyttedeDokumenter = React.memo(
  ({ tilknyttedeDokumenter }: TilknyttedeDokumenterProps) => {
    const oppgaveId = useOppgaveId();

    const { data: lagredeTilknyttedeDokumenter, isLoading, isFetching } = useGetTilknyttedeDokumenterQuery(oppgaveId);

    const documents = useMemo<ITilknyttetDokument[]>(() => {
      if (typeof lagredeTilknyttedeDokumenter === 'undefined') {
        return [];
      }

      return lagredeTilknyttedeDokumenter.dokumenter
        .map((document) => ({
          document,
          tilknyttet: tilknyttedeDokumenter.some((t) => dokumentMatcher(t, document)),
        }))
        .filter(({ document, tilknyttet }) => tilknyttet || document.vedlegg.length !== 0);
    }, [tilknyttedeDokumenter, lagredeTilknyttedeDokumenter]);

    return (
      <Container data-testid="klagebehandling-documents-tilknyttede">
        <Loading loading={isLoading || isFetching} />
        <DokumenterMinivisning data-testid="klagebehandling-documents-tilknyttede-list">
          <TilknyttedeNyeDokumenter />
          <StyledSubHeader>Journalførte dokumenter</StyledSubHeader>
          {documents.map(({ document: dokument, tilknyttet }) => (
            <TilknyttetDocument
              key={dokument.journalpostId + dokument.dokumentInfoId}
              dokument={dokument}
              tilknyttet={tilknyttet}
              tilknyttedeDokumenter={tilknyttedeDokumenter}
            />
          ))}
        </DokumenterMinivisning>
      </Container>
    );
  },
  (previous, next) => previous.tilknyttedeDokumenter === next.tilknyttedeDokumenter
);

interface TilknyttetDocumentProps {
  dokument: IDocument;
  tilknyttet: boolean;
  tilknyttedeDokumenter: IDocumentReference[];
}

const TilknyttetDocument = ({ dokument, tilknyttet, tilknyttedeDokumenter }: TilknyttetDocumentProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();

  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_BASE_QUERY}${oppgaveId}/arkivertedokumenter/${dokument.journalpostId}/${dokument.dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title: dokument.tittel,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <Tilknyttet data-testid="klagebehandling-documents-tilknyttede-list-item">
      <TilknyttetDato dateTime={dokument.registrert}>{isoDateToPretty(dokument.registrert)}</TilknyttetDato>
      <TilknyttetKnapp
        isActive={isActive}
        tilknyttet={tilknyttet}
        onClick={onClick}
        data-testid="klagebehandling-documents-open-document-button"
      >
        {dokument.tittel}
      </TilknyttetKnapp>
      <VedleggListe
        journalpostId={dokument.journalpostId}
        vedleggListe={dokument.vedlegg}
        tilknyttedeDokumenter={tilknyttedeDokumenter}
        klagebehandlingId={oppgaveId}
      />
    </Tilknyttet>
  );
};

TilknyttedeDokumenter.displayName = 'TilknyttedeDokumenter';

const Container = styled.div`
  position: relative;
  padding: 16px;
  width: 300px;
`;

interface VedleggListeProps {
  vedleggListe: IDocumentVedlegg[];
  tilknyttedeDokumenter: IDocumentReference[];
  journalpostId: string;
  klagebehandlingId: string;
}

const VedleggListe = ({ vedleggListe, tilknyttedeDokumenter, journalpostId, klagebehandlingId }: VedleggListeProps) => {
  const tilknyttedeVedlegg = useMemo<IDocumentVedlegg[]>(
    () =>
      vedleggListe.filter((vedlegg) =>
        tilknyttedeDokumenter.some(({ dokumentInfoId }) => dokumentInfoId === vedlegg.dokumentInfoId)
      ),
    [tilknyttedeDokumenter, vedleggListe]
  );

  return (
    <DokumenterMinivisning data-testid="klagebehandling-documents-tilknyttede-vedlegg-list">
      {tilknyttedeVedlegg.map((vedlegg) => (
        <Vedlegg
          key={journalpostId + vedlegg.dokumentInfoId}
          journalpostId={journalpostId}
          vedlegg={vedlegg}
          klagebehandlingId={klagebehandlingId}
        />
      ))}
    </DokumenterMinivisning>
  );
};

interface VedleggProps {
  journalpostId: string;
  vedlegg: IDocumentVedlegg;
  klagebehandlingId: string;
}

const Vedlegg = ({ journalpostId, vedlegg, klagebehandlingId }: VedleggProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_BASE_QUERY}${klagebehandlingId}/arkivertedokumenter/${journalpostId}/${vedlegg.dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title: vedlegg.tittel,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <Tilknyttet data-testid="klagebehandling-documents-tilknyttede-vedlegg-list-item">
      <TilknyttetKnapp
        tilknyttet={true}
        isActive={isActive}
        onClick={onClick}
        data-testid="klagebehandling-documents-open-document-button"
      >
        {vedlegg.tittel}
      </TilknyttetKnapp>
    </Tilknyttet>
  );
};

interface LoadingProps {
  loading: boolean;
}

const Loading = ({ loading }: LoadingProps) =>
  loading ? (
    <SpinnerBackground>
      <NavFrontendSpinner />
    </SpinnerBackground>
  ) : null;

const SpinnerBackground = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  padding: 1em;
`;
