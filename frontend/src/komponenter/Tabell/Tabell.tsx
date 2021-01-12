import {
  Filter,
  OppgaveRad,
  OppgaveRader,
  oppgaveRequest,
  temaType,
} from "../../tilstand/moduler/oppgave";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { velgInnstillinger, velgMeg } from "../../tilstand/moduler/meg.velgere";
import {
  velgFiltrering,
  velgOppgaver,
  velgSideLaster,
  velgSortering,
  velgProjeksjon,
} from "../../tilstand/moduler/oppgave.velgere";
import { tildelMegHandling } from "../../tilstand/moduler/saksbehandler";
import "../../stilark/Tabell.less";
import "../../stilark/TabellHead.less";
import FiltrerbarHeader, { settFilter } from "./FiltrerbarHeader";
import { valgtOppgaveType } from "../types";
import { genererTabellRader } from "./tabellfunksjoner";
import Paginering from "../Paginering/Paginering";
import { useHistory, useParams } from "react-router-dom";
import NavFrontendSpinner from "nav-frontend-spinner";
import { routingRequest } from "../../tilstand/moduler/router";
import { velgForrigeSti } from "../../tilstand/moduler/router.velgere";
import { hentInnstillingerHandling } from "../../tilstand/moduler/meg";
import { GyldigeFiltre, GyldigeTemaer } from "../../domene/filtre";

function initState(filter: Array<string> | undefined) {
  if ("undefined" === typeof filter) {
    return [];
  }
  if (!Array.isArray(filter)) return [{ label: filter }];
  return filter.map(function (f: string) {
    return { label: f, value: f };
  });
}

const OppgaveTabell: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const meg = useSelector(velgMeg);
  const sortering = useSelector(velgSortering);
  const filtrering = useSelector(velgFiltrering);
  const sideLaster = useSelector(velgSideLaster);
  const oppgaver = useSelector(velgOppgaver);
  const forrigeSti = useSelector(velgForrigeSti);
  const utvidetProjeksjon = useSelector(velgProjeksjon);

  interface ParamTypes {
    side: string | undefined;
  }

  let { side } = useParams<ParamTypes>();
  let tolketSide = parseInt(side as string, 10) || 1;

  const [hjemmelFilter, settHjemmelFilter] = useState<string[] | undefined>(undefined);
  const [aktiveHjemler, settAktiveHjemler] = useState<Filter[]>(initState(filtrering.hjemler));

  const [temaFilter, settTemaFilter] = useState<temaType[] | undefined>(undefined);
  const [aktiveTemaer, settAktiveTemaer] = useState<Filter[]>(initState(filtrering.temaer));

  const [typeFilter, settTypeFilter] = useState<string[] | undefined>(undefined);
  const [aktiveTyper, settAktiveTyper] = useState<Filter[]>(initState(filtrering.typer));

  const [sorteringFilter, settSorteringFilter] = useState<"synkende" | "stigende">(sortering.frist);
  const [valgtOppgave, settValgtOppgave] = useState<valgtOppgaveType>({ id: "", versjon: 0 });

  const [antall] = useState<number>(10);
  const [start, settStart] = useState<number>(0);
  const history = useHistory();
  const pathname = history.location.pathname.split("/")[1];
  const innstillinger = useSelector(velgInnstillinger);

  useEffect(() => {
    if (meg.id) dispatch(hentInnstillingerHandling(meg.id));
  }, [meg.id]);
  useEffect(() => {
    if (innstillinger?.aktiveHjemler) {
      const hjemler = innstillinger.aktiveHjemler.map((hjemmel) => hjemmel.value as string);
      if (hjemler.length) {
        settAktiveHjemler(innstillinger.aktiveHjemler);
        settHjemmelFilter(hjemler);
      } else {
        settAktiveHjemler(initState(filtrering.hjemler));
        settHjemmelFilter(undefined);
      }
    }
    if (innstillinger?.aktiveTyper) {
      const typer = innstillinger.aktiveTyper.map((type) => type.value as string);
      if (typer.length) {
        settAktiveTyper(innstillinger.aktiveTyper);
        settTypeFilter(typer);
      } else {
        settAktiveTyper(initState(filtrering.typer));
        settTypeFilter(undefined);
      }
    }
    if (innstillinger?.aktiveTemaer) {
      const temaer = innstillinger.aktiveTemaer.map((type) => type.value as temaType);
      if (temaer.length) {
        settAktiveTemaer(
          innstillinger.aktiveTemaer.concat([{ label: "Sykepenger", value: "Sykepenger" }])
        );
        settTemaFilter(temaer);
      } else {
        settAktiveTemaer(initState(filtrering.temaer));
        settTemaFilter(undefined);
      }
    }

    dispatchTransformering(history.location.pathname.startsWith("/mineoppgaver"));
  }, [innstillinger]);

  useEffect(() => {
    if (valgtOppgave.id) {
      dispatch(
        tildelMegHandling({
          oppgaveId: valgtOppgave.id,
          ident: meg.id,
          versjon: valgtOppgave.versjon,
        })
      );
    }
  }, [valgtOppgave.id]);

  useEffect(() => {
    if (meg.id) dispatchTransformering(history.location.pathname.startsWith("/mineoppgaver"));
  }, [start, meg, hjemmelFilter, temaFilter, typeFilter, sorteringFilter]);

  useEffect(() => {
    settStart((tolketSide - 1) * antall);
    if (forrigeSti.split("/")[1] !== history.location.pathname.split("/")[1]) {
      settHjemmelFilter(undefined);
      settTemaFilter(undefined);
      settTypeFilter(undefined);
      settAktiveTyper([]);
      settAktiveTemaer([]);
      settAktiveHjemler([]);
      dispatch(routingRequest(history.location.pathname));
    }
  }, [antall, tolketSide, forrigeSti, history.location.pathname]);

  const dispatchTransformering = (utvidet: boolean) =>
    dispatch(
      oppgaveRequest({
        ident: meg.id,
        antall: antall,
        start: start,
        enhetId: meg.enhetId,
        projeksjon: utvidet ? "UTVIDET" : undefined,
        tildeltSaksbehandler: utvidet ? meg.id : undefined,
        transformasjoner: {
          filtrering: {
            hjemler: hjemmelFilter,
            typer: typeFilter,
            temaer: temaFilter,
          },
          sortering: {
            frist: sorteringFilter,
          },
        },
      })
    );

  const filtrerType = (filtre: Filter[]) => {
    if (!filtre.length) {
      settTypeFilter(undefined);
    } else {
      settTypeFilter(filtre.map((f) => f.value as string));
    }
    settStart(0);
    history.push(history.location.pathname.replace(/\d+$/, "1"));
  };
  const skiftSortering = (
    event: React.MouseEvent<HTMLElement | HTMLButtonElement>,
    sorteringsfilter: "stigende" | "synkende",
    settSorteringFilter: Function
  ) => {
    event.preventDefault();
    if (sorteringsfilter === "synkende") {
      settSorteringFilter("stigende");
    } else {
      settSorteringFilter("synkende");
    }
    settStart(0);
  };

  const filtrerHjemmel = (filtre: Filter[]) => {
    if (!filtre.length) {
      settHjemmelFilter(undefined);
    } else {
      settHjemmelFilter(filtre.map((f) => f.value as string));
    }
    settStart(0);
    history.push(history.location.pathname.replace(/\d+$/, "1"));
  };
  const filtrerTema = (filtre: Filter[]) => {
    if (!filtre.length) {
      settTemaFilter(undefined);
    } else {
      settTemaFilter(filtre.map((f) => f.value as temaType));
    }
    settStart(0);
    history.push(history.location.pathname.replace(/\d+$/, "1"));
  };

  if (oppgaver.meta.feilmelding) {
    return (
      <div className={"feil"}>
        <h1>{oppgaver.meta.feilmelding}</h1>
        <div>Vennligst forsøk igjen litt senere...</div>
      </div>
    );
  }

  const visAntallTreff = (oppgaver: OppgaveRader) => {
    const antall = oppgaver.meta.side * oppgaver.meta.antall - oppgaver.meta.antall || 1;
    if (oppgaver.meta.totalAntall === 0) {
      return "Ingen treff i oppgavesøket";
    }
    const antallIListe =
      oppgaver.meta.side * oppgaver.meta.antall < oppgaver.meta.totalAntall
        ? oppgaver.meta.side * oppgaver.meta.antall
        : oppgaver.meta.totalAntall;
    const s_oppgave = oppgaver.meta.totalAntall === 1 ? "oppgave" : "oppgaver";
    return `Viser ${antall} til ${antallIListe} av ${oppgaver.meta.totalAntall} ${s_oppgave}`;
  };

  if (sideLaster) {
    return <NavFrontendSpinner />;
  }

  return (
    <>
      <table className={`Tabell tabell oppgaver tabell--stripet`} cellSpacing={0} cellPadding={10}>
        <thead>
          <tr>
            <FiltrerbarHeader
              onFilter={(filter, velgAlleEllerIngen) =>
                settFilter(settAktiveTyper, filter, aktiveTyper, velgAlleEllerIngen)
              }
              filtre={[
                { label: "Klage", value: "Klage" },
                { label: "Anke", value: "Anke" },
                { label: "Feilutbetaling", value: "Feilutbetaling" },
              ]}
              dispatchFunc={filtrerType}
              aktiveFiltere={aktiveTyper}
            >
              Type
            </FiltrerbarHeader>

            <FiltrerbarHeader
              onFilter={(filter, velgAlleEllerIngen) =>
                settFilter(settAktiveTemaer, filter, aktiveTemaer, velgAlleEllerIngen)
              }
              filtre={GyldigeTemaer}
              dispatchFunc={filtrerTema}
              aktiveFiltere={aktiveTemaer}
            >
              Tema
            </FiltrerbarHeader>

            <FiltrerbarHeader
              onFilter={(filter, velgAlleEllerIngen) =>
                settFilter(settAktiveHjemler, filter, aktiveHjemler, velgAlleEllerIngen)
              }
              filtre={GyldigeFiltre}
              dispatchFunc={filtrerHjemmel}
              aktiveFiltere={aktiveHjemler}
            >
              Hjemmel
            </FiltrerbarHeader>

            {utvidetProjeksjon && <th>&nbsp;</th>}
            {utvidetProjeksjon && <th>&nbsp;</th>}

            <th
              role="columnheader"
              aria-sort={sorteringFilter === "stigende" ? "ascending" : "descending"}
            >
              <div
                className={`sortHeader ${
                  sorteringFilter === "stigende" ? "ascending" : "descending"
                }`}
                onClick={(e) => skiftSortering(e, sorteringFilter, settSorteringFilter)}
              >
                Frist
              </div>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {genererTabellRader(settValgtOppgave, oppgaver, utvidetProjeksjon)}
          <tr>
            <td colSpan={utvidetProjeksjon ? 8 : 6}>
              <div className="table-lbl">
                <div className="antall-saker">{visAntallTreff(oppgaver)}</div>
                <div className={"paginering"}>
                  <Paginering
                    startSide={tolketSide}
                    antallSider={oppgaver.meta.sider}
                    pathname={pathname}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default OppgaveTabell;
