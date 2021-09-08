import React from 'react';
import Oppsett from '../komponenter/Oppsett';
import '../stilark/App.less';
import '../stilark/Lists.less';
import 'nav-frontend-tabell-style';
import OppgaveTabell, { TabellVisning } from '../komponenter/Tabell/Tabell';
import { ErrorMessage } from './ErrorMessage';
import { withErrorBoundary } from '../utility/ErrorBoundary';

const ErrorMessageWithErrorBoundary = withErrorBoundary(ErrorMessage);

const App = (): JSX.Element => (
  <Oppsett visMeny={true}>
    <ErrorMessageWithErrorBoundary>
      <OppgaveTabell visFilter={false} tabellVisning={TabellVisning.ENHETENSOPPGAVER} />
    </ErrorMessageWithErrorBoundary>
  </Oppsett>
);

export default App;
