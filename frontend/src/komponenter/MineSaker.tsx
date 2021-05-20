import React, { useEffect } from "react";
import Oppsett from "../komponenter/Oppsett";
import "../stilark/App.less";
import "../stilark/Lists.less";
import "nav-frontend-tabell-style";
import OppgaveTabell from "../komponenter/Tabell/Tabell";

const App = (): JSX.Element => {
  return (
    <Oppsett visMeny={true}>
      <OppgaveTabell visFilter={false} />
    </Oppsett>
  );
};

export default App;
