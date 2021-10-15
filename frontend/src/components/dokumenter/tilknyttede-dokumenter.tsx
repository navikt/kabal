import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../redux-api/common';
import { IDocument, IDocumentVedlegg } from '../../redux-api/documents-types';
import { useGetTilknyttedeDokumenterQuery } from '../../redux-api/oppgave';
import { IDocumentReference } from '../../redux-api/oppgave-types';
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
  klagebehandlingId: string;
  show: boolean;
  tilknyttedeDokumenter: IDocumentReference[];
}

export const TilknyttedeDokumenter = React.memo(
  ({ klagebehandlingId, tilknyttedeDokumenter, show }: TilknyttedeDokumenterProps) => {
    const {
      data: lagredeTilknyttedeDokumenter,
      isLoading,
      isFetching,
    } = useGetTilknyttedeDokumenterQuery(klagebehandlingId);

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

    if (!show) {
      return null;
    }

    return (
      <Container>
        <Loading loading={isLoading || isFetching} />
        <DokumenterMinivisning>
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
  (previous, next) => previous.show === next.show && previous.tilknyttedeDokumenter === next.tilknyttedeDokumenter
);

interface TilknyttetDocumentProps {
  dokument: IDocument;
  tilknyttet: boolean;
  tilknyttedeDokumenter: IDocumentReference[];
}

const TilknyttetDocument = ({ dokument, tilknyttet, tilknyttedeDokumenter }: TilknyttetDocumentProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const klagebehandlingId = useKlagebehandlingId();

  const url = `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${dokument.journalpostId}/${dokument.dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title: dokument.tittel,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <Tilknyttet>
      <TilknyttetDato dateTime={dokument.registrert}>{isoDateToPretty(dokument.registrert)}</TilknyttetDato>
      <TilknyttetKnapp isActive={isActive} tilknyttet={tilknyttet} onClick={onClick}>
        {dokument.tittel}
      </TilknyttetKnapp>
      <VedleggListe
        journalpostId={dokument.journalpostId}
        vedleggListe={dokument.vedlegg}
        tilknyttedeDokumenter={tilknyttedeDokumenter}
        klagebehandlingId={klagebehandlingId}
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
    <DokumenterMinivisning>
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

  const url = `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${journalpostId}/${vedlegg.dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title: vedlegg.tittel,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <Tilknyttet>
      <TilknyttetKnapp tilknyttet={true} isActive={isActive} onClick={onClick}>
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
