import React, { useEffect } from "react";
import Oppsett from "./komponenter/Oppsett";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import "./stilark/App.less";
import "./stilark/Lists.less";
import "nav-frontend-tabell-style";

import { Checkbox } from "nav-frontend-skjema";
import { useDispatch, useSelector } from "react-redux";

import { oppgaveRequest, settSide } from "./tilstand/moduler/oppgave";

import { hentMegHandling } from "./tilstand/moduler/meg";

import { velgOppgaver, velgSideLaster } from "./tilstand/moduler/oppgave.velgere";
import { useParams } from "react-router-dom";
import Paginering from "./komponenter/Paginering/Paginering";
import OppgaveTabell from "./komponenter/Tabell/Tabell";
import { velgMeg } from "./tilstand/moduler/meg.velgere";

const App = (): JSX.Element => {
  const oppgaver = useSelector(velgOppgaver);
  const meg = useSelector(velgMeg);
  const sideLaster = useSelector(velgSideLaster);
  const dispatch = useDispatch();

  interface ParamTypes {
    side: string | undefined;
  }

  const { side } = useParams<ParamTypes>();

  useEffect(() => {
    if (Number(side) > 0) dispatch(settSide(Number(side)));
  }, [side]);

  useEffect(() => {
    dispatch(hentMegHandling());
  }, []);

  useEffect(() => {
    if (meg.id) {
      dispatch(oppgaveRequest({ ident: meg.id, limit: 15, offset: 0, typer: ["Anke", "Klage"] }));
    }
  }, [meg.id]);

  if (oppgaver.meta.feilmelding) {
    return (
      <Oppsett isFetching={false}>
        <div className={"feil"}>
          <h1>{oppgaver.meta.feilmelding}</h1>
          <div>Vennligst forsøk igjen litt senere...</div>
        </div>
      </Oppsett>
    );
  }

  return (
    <Oppsett isFetching={sideLaster}>
      <>
        <OppgaveTabell {...oppgaver} />
        <div className="table-lbl">
          <div className={"paginering"}>
            <Paginering startSide={oppgaver.meta.side} antallSider={oppgaver.meta.sider} />
          </div>
        </div>
      </>
    </Oppsett>
  );
};

export default App;
