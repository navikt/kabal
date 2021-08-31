import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./tilstand/konfigurerTilstand";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import MineSaker from "./komponenter/MineSaker";
import Sok from "./komponenter/Sok";
import AlleSaker from "./komponenter/AlleSaker";
import EnhetensOppgaver from "./komponenter/EnhetensOppgaver";
import Innstillinger from "./komponenter/Innstillinger";
import Admin from "./komponenter/Admin";
import { KlagebehandlingLaster } from "./komponenter/Klagebehandling/KlagebehandlingLaster";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/klagebehandling/:id" render={() => <KlagebehandlingLaster />} />
          <Route exact path="/oppgaver" render={() => <AlleSaker />} />
          <Route exact path="/enhetensoppgaver" render={() => <EnhetensOppgaver />} />
          <Route exact path="/oppgaver/:side" render={() => <AlleSaker />} />
          <Route exact path="/mineoppgaver" render={() => <MineSaker />} />
          <Route exact path="/mineoppgaver/:side" render={() => <MineSaker />} />
          <Route exact path="/sok" render={() => <Sok />} />
          <Route exact path="/innstillinger" render={() => <Innstillinger />} />
          <Route exact path="/admin" render={() => <Admin />} />
          <Redirect to="/oppgaver" />
        </Switch>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
