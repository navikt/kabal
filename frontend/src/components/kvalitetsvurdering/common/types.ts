import type {
  IKvalitetsvurderingAnkeAfter2027,
  KvalitetsvurderingDataAnkeAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-after-2027';
import type {
  IKvalitetsvurderingAnkeITRAfter2027,
  KvalitetsvurderingDataAnkeITRAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import type {
  KvalitetsvurderingDataV3,
  IKvalitetsvurdering as KvalitetsvurderingV3,
} from '@/types/kaka-kvalitetsvurdering/v3';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

type Kvalitetsvurdering = KvalitetsvurderingV3 | IKvalitetsvurderingAnkeAfter2027 | IKvalitetsvurderingAnkeITRAfter2027;

type KvalitetsvurderingData =
  | KvalitetsvurderingDataV3
  | KvalitetsvurderingDataAnkeAfter2027
  | KvalitetsvurderingDataAnkeITRAfter2027;

export interface LoadingState {
  oppgave: undefined;
  hjemler: string[];
  kvalitetsvurdering: undefined;
  update: undefined;
  isLoading: true;
  isSuccess: false;
}

export interface ErrorOrNotRelevantState {
  oppgave: undefined;
  hjemler: string[];
  kvalitetsvurdering: undefined;
  update: undefined;
  isLoading: false;
  isSuccess: false;
}

export interface LoadedState<TVurdering extends Kvalitetsvurdering & TData, TData extends KvalitetsvurderingData> {
  oppgave: IOppgavebehandling;
  hjemler: string[];
  kvalitetsvurdering: TVurdering;
  update: (patch: Partial<TData>) => Promise<TVurdering>;
  isLoading: false;
  isSuccess: true;
}
