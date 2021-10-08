import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formattedDate } from '../../domene/datofunksjoner';
import { baseUrl } from '../../redux-api/common';
import { useGetTilknyttedeDokumenterQuery } from '../../redux-api/dokumenter/api';
import { IDokumentVedlegg } from '../../redux-api/dokumenter/types';
import { IDocumentReference } from '../../redux-api/oppgave-types';
import { IShownDokument } from '../show-document/types';
import { dokumentMatcher } from './helpers';
import { DokumenterMinivisning, Tilknyttet, TilknyttetDato, TilknyttetKnapp } from './styled-components/minivisning';
import { ITilknyttetDokument } from './types';

interface TilknyttedeDokumenterProps {
  klagebehandlingId: string;
  show: boolean;
  tilknyttedeDokumenter: IDocumentReference[];
  setShownDocument: (document: IShownDokument) => void;
}

export const TilknyttedeDokumenter = React.memo(
  ({ klagebehandlingId, setShownDocument, tilknyttedeDokumenter, show }: TilknyttedeDokumenterProps) => {
    const { data: lagredeTilknyttedeDokumenter, isLoading } = useGetTilknyttedeDokumenterQuery(klagebehandlingId);

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

    if (!show || documents.length === 0) {
      return null;
    }

    return (
      <Container>
        <Loading loading={isLoading} />
        <DokumenterMinivisning>
          {documents.map(({ document: dokument, tilknyttet }) => (
            <Tilknyttet key={dokument.journalpostId + dokument.dokumentInfoId}>
              <TilknyttetDato dateTime={dokument.registrert}>{formattedDate(dokument.registrert)}</TilknyttetDato>
              <TilknyttetKnapp
                tilknyttet={tilknyttet}
                onClick={() =>
                  setShownDocument({
                    title: dokument.tittel,
                    url: `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${dokument.journalpostId}/${dokument.dokumentInfoId}/pdf`,
                  })
                }
              >
                {dokument.tittel}
              </TilknyttetKnapp>
              <VedleggListe
                journalpostId={dokument.journalpostId}
                vedleggListe={dokument.vedlegg}
                tilknyttedeDokumenter={tilknyttedeDokumenter}
                klagebehandlingId={klagebehandlingId}
                setShownDocument={setShownDocument}
              />
            </Tilknyttet>
          ))}
        </DokumenterMinivisning>
      </Container>
    );
  },
  (previous, next) => previous.show === next.show && previous.tilknyttedeDokumenter === next.tilknyttedeDokumenter
);

TilknyttedeDokumenter.displayName = 'TilknyttedeDokumenter';

const Container = styled.div`
  position: relative;
`;

interface VedleggListeProps {
  vedleggListe: IDokumentVedlegg[];
  tilknyttedeDokumenter: IDocumentReference[];
  journalpostId: string;
  klagebehandlingId: string;
  setShownDocument: (document: IShownDokument) => void;
}

const VedleggListe = ({
  vedleggListe,
  tilknyttedeDokumenter,
  journalpostId,
  klagebehandlingId,
  setShownDocument,
}: VedleggListeProps) => {
  const tilknyttedeVedlegg = useMemo<IDokumentVedlegg[]>(
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
          setShownDocument={setShownDocument}
        />
      ))}
    </DokumenterMinivisning>
  );
};

interface VedleggProps {
  journalpostId: string;
  vedlegg: IDokumentVedlegg;
  klagebehandlingId: string;
  setShownDocument: (document: IShownDokument) => void;
}

const Vedlegg = ({ journalpostId, vedlegg, klagebehandlingId, setShownDocument }: VedleggProps) => (
  <Tilknyttet>
    <TilknyttetKnapp
      tilknyttet={true}
      onClick={() =>
        setShownDocument({
          title: vedlegg.tittel,
          url: `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${journalpostId}/${vedlegg.dokumentInfoId}/pdf`,
        })
      }
    >
      {vedlegg.tittel}
    </TilknyttetKnapp>
  </Tilknyttet>
);
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
