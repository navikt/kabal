import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavFrontendSpinner from "nav-frontend-spinner";
import { formattedDate } from "../../../domene/datofunksjoner";
import { useAppDispatch, useAppSelector } from "../../../tilstand/konfigurerTilstand";
import {
  IDokument,
  IDokumentListe,
  IDokumentVedlegg,
} from "../../../tilstand/moduler/dokumenter/stateTypes";
import { IShownDokument, ITilknyttetDokument, ITilknyttetVedlegg } from "./typer";
import {
  hentDokumenter,
  nullstillOgHentDokumenter,
} from "../../../tilstand/moduler/dokumenter/actions";
import { useKanEndre } from "../utils/hooks";
import { IKlagebehandling } from "../../../tilstand/moduler/klagebehandling/stateTypes";
import { dokumentMatcher } from "./helpers";
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
} from "./styled-components/fullvisning";
import {
  FRAKOBLE_DOKUMENT,
  TILKNYTT_DOKUMENT,
} from "../../../tilstand/moduler/klagebehandling/state";
import { TilknyttetDokument } from "../../../tilstand/moduler/klagebehandling/types";
import { useSelector } from "react-redux";
import { velgKodeverk } from "../../../tilstand/moduler/kodeverk.velgere";
import { Kodeverk } from "../../Tabell/tabellfunksjoner";
import FiltrerbarHeader, { settFilter } from "../../Tabell/FiltrerbarHeader";
import { Filter } from "../../../tilstand/moduler/oppgave";
import { IKodeverkVerdi } from "../../../tilstand/moduler/kodeverk";
import { velgMeg } from "../../../tilstand/moduler/meg.velgere";

const R = require("ramda");

interface AlleDokumenterProps {
  dokumenter: IDokumentListe;
  klagebehandling: IKlagebehandling;
  skjult: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

export const AlleDokumenter = React.memo(
  ({ dokumenter, klagebehandling, skjult, visDokument }: AlleDokumenterProps) => {
    const meg = useSelector(velgMeg);
    const { enheter, valgtEnhet } = meg;

    const [temaFilter, settTemaFilter] = useState<string[] | undefined>(undefined);
    const [lovligeTemaer, settLovligeTemaer] = useState<Filter[]>([]);
    const [aktiveTemaer, settAktiveTemaer] = useState<Filter[]>([]);

    const dispatch = useAppDispatch();

    const kodeverk = useSelector(velgKodeverk);

    useEffect(() => {
      let lovligeTemaer: Filter[] = [];
      if (enheter.length > 0) {
        valgtEnhet.lovligeTemaer?.forEach((tema: string | any) => {
          if (kodeverk?.kodeverk.tema) {
            let kodeverkTema = kodeverk.kodeverk.tema.filter(
              (t: IKodeverkVerdi) => t.id.toString() === tema.toString()
            )[0];
            if (kodeverkTema?.id)
              lovligeTemaer.push({
                label: kodeverkTema?.beskrivelse,
                value: kodeverkTema?.id.toString(),
              });
          }
        });
      }
      settLovligeTemaer(lovligeTemaer);
    }, [kodeverk]);
    const filtrerTema = (filtre: Filter[]) => {
      if (!filtre.length) {
        settTemaFilter([]);
      } else {
        settTemaFilter(filtre.map((f) => f.value as string));
      }
    };
    useEffect(() => {
      if (temaFilter)
        dispatch(
          nullstillOgHentDokumenter({
            klagebehandlingId: klagebehandling.id,
            pageReference: dokumenter.pageReference,
            temaFilter,
          })
        );
    }, [temaFilter]);
    const kanEndre = useKanEndre();
    const alleDokumenter = useMemo<ITilknyttetDokument[]>(
      () =>
        dokumenter.dokumenter.map((dokument) => ({
          dokument,
          tilknyttet: klagebehandling.tilknyttedeDokumenter.some((t) =>
            dokumentMatcher(t, dokument)
          ),
        })),
      [dokumenter.dokumenter, klagebehandling.tilknyttedeDokumenter]
    );

    if (skjult) {
      return null;
    }

    if (dokumenter.loading && alleDokumenter.length === 0) {
      return <NavFrontendSpinner />;
    }

    return (
      <DokumenterFullvisning>
        <table>
          <thead>
            <tr>
              <FiltrerbarHeader
                data-testid={"typefilter"}
                onFilter={(filter, velgAlleEllerIngen) =>
                  settFilter(settAktiveTemaer, filter, aktiveTemaer, velgAlleEllerIngen)
                }
                filtre={lovligeTemaer}
                dispatchFunc={filtrerTema}
                aktiveFiltere={aktiveTemaer}
              >
                Tema
              </FiltrerbarHeader>
            </tr>
          </thead>
        </table>
        <List data-testid={"dokumenter"}>
          {alleDokumenter.map(({ dokument, tilknyttet }) => (
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
        <LastFlere
          dokumenter={dokumenter}
          klagebehandlingId={klagebehandling.id}
          loading={dokumenter.loading}
          temaFilter={temaFilter}
        />
      </DokumenterFullvisning>
    );
  },
  (previous, next) =>
    previous.skjult === next.skjult &&
    previous.dokumenter.loading === next.dokumenter.loading &&
    previous.dokumenter.dokumenter === next.dokumenter.dokumenter &&
    previous.klagebehandling.id === next.klagebehandling.id &&
    previous.visDokument === next.visDokument
);

interface DokumentProps extends ITilknyttetDokument {
  klagebehandling: IKlagebehandling;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

const Dokument = React.memo<DokumentProps>(
  ({ dokument, tilknyttet, kanEndre, visDokument, klagebehandling }) => {
    const dispatch = useAppDispatch();
    const { kodeverk } = useAppSelector(velgKodeverk);
    const KodeverkTema = R.curry(Kodeverk)(kodeverk.tema);

    const onShowDokument = ({
      journalpostId,
      dokumentInfoId,
      tittel,
      harTilgangTilArkivvariant,
    }: IDokument) =>
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
          className={`etikett etikett--mw etikett--info etikett--${dokument
            .tema!.split(" ")[0]
            .toLowerCase()}`}
        >
          <TemaText> {KodeverkTema(dokument.tema)}</TemaText>
        </DokumentTema>
        <DokumentDato onClick={() => onShowDokument(dokument)} className={"liten"}>
          {formattedDate(dokument.registrert)}
        </DokumentDato>

        <DokumentSjekkboks>
          <RightAlign>
            <DokumentCheckbox
              label={""}
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
      <VedleggBeholder data-testid={"vedlegg"}>
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

interface VedleggKomponentProps {
  dokument: IDokument;
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

const VedleggKomponent = React.memo<VedleggKomponentProps>(
  ({ vedlegg, dokument, tilknyttet, kanEndre, visDokument }) => {
    const dispatch = useAppDispatch();

    const onCheck = (checked: boolean) => {
      const d: TilknyttetDokument = {
        journalpostId: dokument.journalpostId,
        dokumentInfoId: vedlegg.dokumentInfoId,
      };
      dispatch(checked ? TILKNYTT_DOKUMENT(d) : FRAKOBLE_DOKUMENT(d));
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
        <DokumentSjekkboks className={"dokument-sjekkboks"}>
          <RightAlign>
            <DokumentCheckbox
              label={""}
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

interface LoadMoreProps {
  dokumenter: IDokumentListe;
  klagebehandlingId: string;
  temaFilter: string[] | undefined;
  loading: boolean;
}

const LastFlere = ({ dokumenter, klagebehandlingId, temaFilter, loading }: LoadMoreProps) => {
  const dispatch = useAppDispatch();
  const onClick = useCallback(
    () =>
      dispatch(
        hentDokumenter({ klagebehandlingId, pageReference: dokumenter.pageReference, temaFilter })
      ),
    [dokumenter.pageReference, klagebehandlingId]
  );

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
