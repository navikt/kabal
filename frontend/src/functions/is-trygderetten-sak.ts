import { SaksTypeEnum } from '@/types/kodeverk';
import type {
  IBegjæringOmGjenopptakITRBehandling,
  IOppgavebehandling,
  ITrygderettsankebehandling,
} from '@/types/oppgavebehandling/oppgavebehandling';

type TrygderettenSakType = SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;

type TrygderettenSak = ITrygderettsankebehandling | IBegjæringOmGjenopptakITRBehandling;

export const isTrygderettenTypeId = (typeId: SaksTypeEnum): typeId is TrygderettenSakType =>
  typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;

export const isTrygderettenBehandling = (oppgave: IOppgavebehandling): oppgave is TrygderettenSak =>
  isTrygderettenTypeId(oppgave.typeId);
