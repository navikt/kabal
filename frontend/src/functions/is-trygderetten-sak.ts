import { SaksTypeEnum } from '@/types/kodeverk';
import type {
  IAnkeITRAfter2027Behandling,
  IBegjæringOmGjenopptakITRBehandling,
  IOppgavebehandling,
  ITrygderettsankebehandling,
} from '@/types/oppgavebehandling/oppgavebehandling';

export type TrygderettenSakType =
  | SaksTypeEnum.ANKE_I_TRYGDERETTEN
  | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR
  | SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027;

type TrygderettenSak = ITrygderettsankebehandling | IBegjæringOmGjenopptakITRBehandling | IAnkeITRAfter2027Behandling;

export const isTrygderettenTypeId = (typeId: SaksTypeEnum): typeId is TrygderettenSakType =>
  typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
  typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR ||
  typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027;

export const isTrygderettenBehandling = (oppgave: IOppgavebehandling): oppgave is TrygderettenSak =>
  isTrygderettenTypeId(oppgave.typeId);
