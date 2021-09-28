import React, { useCallback, useMemo, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { formattedDate } from '../../domene/datofunksjoner';
import { ITilknyttetDokument, ITilknyttetVedlegg } from './types';
import { useKanEndre } from '../../hooks';
import { dokumentMatcher } from './helpers';
import {
  DokumentCheckbox,
  DokumentDato,
  DokumenterFullvisning,
  DokumentRad,
  DokumentSjekkboks,
  DokumentTema,
  DokumentTittel,
  List,
  ListItem,
  RightAlign,
  StyledLastFlereKnapp,
  TemaText,
  VedleggBeholder,
  VedleggRad,
  VedleggTittel,
} from './styled-components/fullvisning';
import { IDokument, IDokumentListe, IDokumentVedlegg } from '../../redux-api/dokumenter/state-types';
import { IKlagebehandling, TilknyttetDokument } from '../../redux-api/oppgave-state-types';
import { IShownDokument } from '../show-document/types';
import { useGetDokumenterQuery } from '../../redux-api/dokumenter/api';
import { useAvailableTemaer } from '../../hooks/use-available-temaer';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';

interface AlleDokumenterProps {
  klagebehandling: IKlagebehandling;
  skjult: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

export const AlleDokumenter = React.memo(
  ({ klagebehandling, skjult, visDokument }: AlleDokumenterProps) => {
    const [pageReference, setPageReference] = useState<string | null>(null);
    const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);

    const { data: alleDokumenter, isLoading } = useGetDokumenterQuery({
      klagebehandlingId: klagebehandling.id,
      pageReference,
      temaer: selectedTemaer,
    });

    const availableTemaer = useAvailableTemaer();

    const kanEndre = useKanEndre();

    const dokumenter = useMemo<ITilknyttetDokument[]>(() => {
      if (typeof alleDokumenter === 'undefined') {
        return [];
      }
      return alleDokumenter.dokumenter.map((dokument) => ({
        dokument,
        tilknyttet: klagebehandling.tilknyttedeDokumenter.some((t) => dokumentMatcher(t, dokument)),
      }));
    }, [alleDokumenter, klagebehandling.tilknyttedeDokumenter]);

    if (skjult) {
      return null;
    }

    if (isLoading || typeof alleDokumenter === 'undefined') {
      return <NavFrontendSpinner />;
    }

    return (
      <DokumenterFullvisning>
        <table>
          <thead>
            <tr>
              <th>
                <FilterDropdown options={availableTemaer} onChange={setSelectedTemaer} selected={selectedTemaer}>
                  Tema
                </FilterDropdown>
              </th>
            </tr>
          </thead>
        </table>
        <List data-testid={'dokumenter'}>
          {dokumenter.map(({ dokument, tilknyttet }) => (
            <ListItem key={`dokument_${dokument.journalpostId}_${dokument.dokumentInfoId}`}>
              <Dokument
                kanEndre={kanEndre}
                dokument={dokument}
                tilknyttet={tilknyttet}
                visDokument={visDokument}
                klagebehandling={klagebehandling}
              />
            </ListItem>
          ))}
        </List>
        <LoadMore dokumenter={alleDokumenter} loading={isLoading} setPage={setPageReference} />
      </DokumenterFullvisning>
    );
  },
  (previous, next) =>
    previous.skjult === next.skjult &&
    previous.klagebehandling.id === next.klagebehandling.id &&
    previous.visDokument === next.visDokument
);

AlleDokumenter.displayName = 'AlleDokumenter';

interface DokumentProps extends ITilknyttetDokument {
  klagebehandling: IKlagebehandling;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

const Dokument = React.memo<DokumentProps>(
  ({ dokument, tilknyttet, kanEndre, visDokument, klagebehandling }) => {
    const onShowDokument = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: IDokument) =>
      visDokument({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant });

    const onCheck = (checked: boolean) => {
      const d: TilknyttetDokument = {
        journalpostId: dokument.journalpostId,
        dokumentInfoId: dokument.dokumentInfoId,
      };
      dispatch(checked ? TILKNYTT_DOKUMENT(d) : FRAKOBLE_DOKUMENT(d));
    };

    return (
      <DokumentRad>
        <DokumentTittel onClick={() => onShowDokument(dokument)}>{dokument.tittel}</DokumentTittel>
        <DokumentTema
          onClick={() => onShowDokument(dokument)}
          className={`etikett etikett--mw etikett--info etikett--${dokument.tema!.split(' ')[0].toLowerCase()}`}
        >
          <TemaText> {KodeverkTema(dokument.tema)}</TemaText>
        </DokumentTema>
        <DokumentDato onClick={() => onShowDokument(dokument)} className={'liten'}>
          {formattedDate(dokument.registrert)}
        </DokumentDato>

        <DokumentSjekkboks>
          <RightAlign>
            <DokumentCheckbox
              label={''}
              disabled={!dokument.harTilgangTilArkivvariant || !kanEndre}
              defaultChecked={tilknyttet}
              onChange={(e) => onCheck(e.currentTarget.checked)}
            />
          </RightAlign>
        </DokumentSjekkboks>
        <VedleggListe
          dokument={dokument}
          klagebehandling={klagebehandling}
          kanEndre={kanEndre}
          visDokument={visDokument}
        />
      </DokumentRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.kanEndre === next.kanEndre &&
    dokumentMatcher(previous.dokument, next.dokument)
);

Dokument.displayName = 'Dokument';

interface VedleggListeProps {
  klagebehandling: IKlagebehandling;
  dokument: IDokument;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

const VedleggListe = React.memo(
  ({ klagebehandling, dokument, kanEndre, visDokument }: VedleggListeProps) => {
    const vedleggListe = useMemo<ITilknyttetVedlegg[]>(
      () =>
        dokument.vedlegg.map((vedlegg) => ({
          vedlegg,
          tilknyttet: klagebehandling.tilknyttedeDokumenter.some(
            ({ dokumentInfoId, journalpostId }) =>
              vedlegg.dokumentInfoId === dokumentInfoId && dokument.journalpostId === journalpostId
          ),
        })),
      [dokument.vedlegg, dokument.journalpostId, klagebehandling.tilknyttedeDokumenter]
    );

    if (dokument.vedlegg.length === 0) {
      return null;
    }

    return (
      <VedleggBeholder data-testid={'vedlegg'}>
        {vedleggListe.map(({ vedlegg, tilknyttet }) => (
          <VedleggKomponent
            key={`vedlegg_${dokument.journalpostId}_${vedlegg.dokumentInfoId}`}
            kanEndre={kanEndre}
            vedlegg={vedlegg}
            dokument={dokument}
            tilknyttet={tilknyttet}
            visDokument={visDokument}
          />
        ))}
      </VedleggBeholder>
    );
  },
  (previous, next) =>
    previous.kanEndre === next.kanEndre &&
    dokumentMatcher(previous.dokument, next.dokument) &&
    previous.klagebehandling.tilknyttedeDokumenter === next.klagebehandling.tilknyttedeDokumenter
);

VedleggListe.displayName = 'VedleggListe';

interface VedleggKomponentProps {
  dokument: IDokument;
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

const VedleggKomponent = React.memo<VedleggKomponentProps>(
  ({ vedlegg, dokument, tilknyttet, kanEndre, visDokument }) => {
    const onCheck = (checked: boolean) => {
      // const d: TilknyttetDokument = {
      //   journalpostId: dokument.journalpostId,
      //   dokumentInfoId: vedlegg.dokumentInfoId,
      // };
      // dispatch(checked ? TILKNYTT_DOKUMENT(d) : FRAKOBLE_DOKUMENT(d));
    };

    const onVisDokument = () =>
      visDokument({
        journalpostId: dokument.journalpostId,
        dokumentInfoId: vedlegg.dokumentInfoId,
        tittel: vedlegg.tittel,
        harTilgangTilArkivvariant: vedlegg.harTilgangTilArkivvariant,
      });

    return (
      <VedleggRad key={dokument.journalpostId + vedlegg.dokumentInfoId}>
        <VedleggTittel onClick={onVisDokument}>{vedlegg.tittel}</VedleggTittel>
        <DokumentSjekkboks className={'dokument-sjekkboks'}>
          <RightAlign>
            <DokumentCheckbox
              label={''}
              disabled={!vedlegg.harTilgangTilArkivvariant || !kanEndre}
              defaultChecked={tilknyttet}
              onChange={(e) => onCheck(e.currentTarget.checked)}
            />
          </RightAlign>
        </DokumentSjekkboks>
      </VedleggRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.kanEndre === next.kanEndre &&
    previous.vedlegg.dokumentInfoId === next.vedlegg.dokumentInfoId &&
    dokumentMatcher(previous.dokument, next.dokument)
);

VedleggKomponent.displayName = 'VedleggKomponent';

interface LoadMoreProps {
  dokumenter: IDokumentListe;
  loading: boolean;
  setPage: (pageReference: string | null) => void;
}

const LoadMore = ({ dokumenter, loading, setPage }: LoadMoreProps) => {
  const onClick = useCallback(() => setPage(dokumenter.pageReference), [dokumenter.pageReference, setPage]);

  const remaining = dokumenter.totaltAntall - dokumenter.dokumenter.length;
  const hasMore = remaining !== 0;

  if (!hasMore) {
    return null;
  }

  return (
    <StyledLastFlereKnapp onClick={onClick} spinner={loading} autoDisableVedSpinner={true}>
      Last flere ({remaining})
    </StyledLastFlereKnapp>
  );
};
