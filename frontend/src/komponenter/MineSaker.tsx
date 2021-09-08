import React from 'react';
import Oppsett from '../komponenter/Oppsett';
import '../stilark/App.less';
import '../stilark/Lists.less';
import 'nav-frontend-tabell-style';
import OppgaveTabell, { TabellVisning } from '../komponenter/Tabell/Tabell';
import { withErrorBoundary } from '../utility/ErrorBoundary';
import { ErrorMessage } from './ErrorMessage';

const ErrorMessageWithErrorBoundary = withErrorBoundary(ErrorMessage);

const App = (): JSX.Element => (
  <Oppsett visMeny={true}>
    <ErrorMessageWithErrorBoundary>
      <OppgaveTabell visFilter={false} tabellVisning={TabellVisning.MINEOPPGAVER} />
    </ErrorMessageWithErrorBoundary>
  </Oppsett>
);

export default App;
