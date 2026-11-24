import type { IOppgavebehandling, KakaBehandling, KantBehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export interface IKvalitetsvurderingBase {
  readonly id: string;
  readonly created: string; // LocalDateTime;
  modified: string; // LocalDateTime;
}
export const isKakaKvalitetsvurdering = (oppgave: IOppgavebehandling): oppgave is KakaBehandling =>
  'kvalitetsvurderingReference' in oppgave && oppgave.kvalitetsvurderingReference !== null;

export const isKantKvalitetsvurdering = (
  oppgave: IOppgavebehandling,
): oppgave is KantBehandling & { kantReference: string } =>
  'kantReference' in oppgave && oppgave.kantReference !== null;

export const getKvalitetsvurderingId = (oppgave: IOppgavebehandling): string | null => {
  if (isKakaKvalitetsvurdering(oppgave)) {
    return oppgave.kvalitetsvurderingReference.id;
  }

  return isKantKvalitetsvurdering(oppgave) ? oppgave.kantReference : null;
};
