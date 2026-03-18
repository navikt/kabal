import { withFaroProfiler } from '@grafana/faro-react';
import { Oppgavebehandling } from '@/components/oppgavebehandling/oppgavebehandling';

const OppgavebehandlingPageBase = () => <Oppgavebehandling />;

export const OppgavebehandlingPage = withFaroProfiler(OppgavebehandlingPageBase);
