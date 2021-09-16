import React, { useEffect, useState } from 'react';
import Oppsett from './Oppsett';
import FiltrerbarHeader, { settFilter } from './Tabell/FiltrerbarHeader';
import { IKodeverkVerdi } from '../tilstand/moduler/kodeverk';
import { Filter } from '../tilstand/moduler/oppgave';
import { useSelector } from 'react-redux';
import { velgFiltrering } from '../tilstand/moduler/oppgave.velgere';
import { Knapp } from 'nav-frontend-knapper';
import { velgInnstillinger, velgMeg } from '../tilstand/moduler/meg.velgere';
import { Faner, hentInnstillingerHandling, settInnstillingerHandling } from '../tilstand/moduler/meg';
import styled from 'styled-components';
import { useAppDispatch } from '../tilstand/konfigurerTilstand';
import { velgKodeverk } from '../tilstand/moduler/kodeverk.velgere';
import { EtikettType, EtikettHjemmel } from '../styled-components/Etiketter';

function initState(filter: Array<string> | undefined): Filter[] {
  if ('undefined' === typeof filter) {
    return [];
  }
  return filter.map(function (f: string) {
    return { label: f, value: f };
  });
}

const TableRow = styled.td``;

const Innstillinger = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const filtrering = useSelector(velgFiltrering);
  const faner = {};
  const meg = useSelector(velgMeg);
  const { enheter, valgtEnhet } = meg;
  const innstillinger = useSelector(velgInnstillinger);
  const [reload, settReload] = useState<boolean>(false);
  const [typeFilter, settTypeFilter] = useState<string[] | undefined>(undefined);
  const [aktiveTyper, settAktiveTyper] = useState<Filter[]>(initState(filtrering.typer));
  const [hjemmelFilter, settHjemmelFilter] = useState<string[] | undefined>(undefined);
  const [aktiveHjemler, settAktiveHjemler] = useState<Filter[]>(initState(filtrering.hjemler));
  const [temaFilter, settTemaFilter] = useState<string[] | undefined>(undefined);
  const [aktiveTemaer, settAktiveTemaer] = useState<Filter[]>(initState(filtrering.temaer));
  const [aktiveFaner, settAktiveFaner] = useState<Faner>(faner);
  const [lovligeTemaer, settLovligeTemaer] = useState<Filter[]>([]);
  const [gyldigeHjemler, settGyldigeHjemler] = useState<Filter[]>([]);
  const [gyldigeTyper, settGyldigeTyper] = useState<Filter[]>([]);

  const kodeverk = useSelector(velgKodeverk);

  useEffect(() => {
    if (meg.graphData.id)
      dispatch(
        hentInnstillingerHandling({
          navIdent: meg.graphData.id,
          enhetId: valgtEnhet.id,
        })
      );
  }, [meg.graphData.id, valgtEnhet, reload]);

  useEffect(() => {
    const lovligeTemaer: Filter[] = [];
    if (enheter.length > 0) {
      valgtEnhet.lovligeTemaer?.forEach((tema: string | any) => {
        if (kodeverk?.kodeverk.tema) {
          const kodeverkTema = kodeverk.kodeverk.tema.filter(
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

    const hjemler: Filter[] = [];
    if (kodeverk.kodeverk.hjemmel) {
      kodeverk.kodeverk.hjemmel.map((hjemmel: IKodeverkVerdi) => {
        hjemler.push({ label: hjemmel.beskrivelse, value: hjemmel.id.toString() });
      });
      settGyldigeHjemler(hjemler);
    }

    const typer: Filter[] = [];
    if (kodeverk.kodeverk.type) {
      kodeverk.kodeverk.type.map((verdi: IKodeverkVerdi) => {
        typer.push({ label: verdi.beskrivelse, value: verdi.id.toString() });
      });
      settGyldigeTyper(typer);
    }
  }, [enheter, valgtEnhet, reload]);

  useEffect(() => {
    settAktiveHjemler(innstillinger?.aktiveHjemler ?? []);
    settAktiveTyper(innstillinger?.aktiveTyper ?? []);
    settAktiveTemaer(innstillinger?.aktiveTemaer ?? []);
  }, [innstillinger, meg.graphData.id, reload]);

  const lagreInnstillinger = () => {
    settReload(true);
    dispatch(
      settInnstillingerHandling({
        navIdent: meg.graphData.id,
        enhetId: valgtEnhet.id,
        innstillinger: {
          aktiveHjemler,
          aktiveTyper,
          aktiveTemaer,
          aktiveFaner,
        },
      })
    );
  };

  useEffect(() => {
    if (reload) settReload(false);
  }, [reload]);

  const filtrerTema = (filtre: Filter[]) => {
    if (!filtre.length) {
      settTemaFilter(undefined);
    } else {
      settTemaFilter(filtre.map((f) => f.value as string));
    }
    lagreInnstillinger();
  };
  const filtrerType = (filtre: Filter[]) => {
    if (!filtre.length) {
      settTypeFilter(undefined);
    } else {
      settTypeFilter(filtre.map((f) => f.value as string));
    }
    lagreInnstillinger();
  };
  const filtrerHjemmel = (filtre: Filter[]) => {
    if (!filtre.length) {
      settHjemmelFilter(undefined);
    } else {
      settHjemmelFilter(filtre.map((f) => f.value as string));
    }
    lagreInnstillinger();
  };
  return (
    <Oppsett visMeny={false}>
      <div className={'innstillinger'}>
        <h1>Innstillinger</h1>
        <h3>Velg hvilke temaer og hjemler du har kompetanse til å behandle</h3>
        <table className={'innstillinger'}>
          <thead>
            <tr>
              <FiltrerbarHeader
                data-testid={'typefilter'}
                onFilter={(filter, velgAlleEllerIngen) =>
                  settFilter(settAktiveTyper, filter, aktiveTyper, velgAlleEllerIngen)
                }
                filtre={gyldigeTyper}
                dispatchFunc={filtrerType}
                aktiveFiltere={aktiveTyper}
              >
                Type
              </FiltrerbarHeader>

              <FiltrerbarHeader
                onFilter={(filter, velgAlleEllerIngen) =>
                  settFilter(settAktiveTemaer, filter, aktiveTemaer, velgAlleEllerIngen)
                }
                filtre={lovligeTemaer}
                dispatchFunc={filtrerTema}
                aktiveFiltere={aktiveTemaer}
              >
                Temaer
              </FiltrerbarHeader>

              <FiltrerbarHeader
                onFilter={(filter, velgAlleEllerIngen) =>
                  settFilter(settAktiveHjemler, filter, aktiveHjemler, velgAlleEllerIngen)
                }
                filtre={gyldigeHjemler}
                dispatchFunc={filtrerHjemmel}
                aktiveFiltere={aktiveHjemler}
              >
                Hjemmel
              </FiltrerbarHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableRow>
                {!aktiveTyper.length && <div>Ingen typer valgt</div>}
                {aktiveTyper.map((a, idx) => (
                  <div key={`type${idx}`}>
                    <EtikettType>{a.label}</EtikettType>
                  </div>
                ))}
              </TableRow>

              <TableRow>
                {!aktiveTemaer.length && <div>Ingen temaer valgt</div>}
                {aktiveTemaer.map((a, idx) => (
                  <div key={`tema${idx}`}>
                    <EtikettHjemmel>{a.label}</EtikettHjemmel>
                  </div>
                ))}
              </TableRow>
              <TableRow>
                {!aktiveHjemler.length && <div>Ingen hjemler valgt</div>}
                {aktiveHjemler.map((a, idx) => (
                  <div key={`hjemmel${idx}`}>
                    <EtikettHjemmel>{a.label}</EtikettHjemmel>
                  </div>
                ))}
              </TableRow>
            </tr>
            <tr className={'skjult'}>
              <td colSpan={2} className={'lagre'}>
                <Knapp data-testid={`lagre`} className={'knapp'} onClick={lagreInnstillinger}>
                  Lagre
                </Knapp>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Oppsett>
  );
};

export default Innstillinger;
