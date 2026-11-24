import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryAnkeAfter2027 } from '@/redux-api/kvalitetsvurdering/anke-after-2027';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryAnkeITRAfter2027 } from '@/redux-api/kvalitetsvurdering/anke-i-tr-after-2027';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV1 } from '@/redux-api/kvalitetsvurdering/v1';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV2 } from '@/redux-api/kvalitetsvurdering/v2';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV3 } from '@/redux-api/kvalitetsvurdering/v3';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IKvalitetsvurderingAnkeAfter2027 } from '@/types/kvalitetsvurdering/anke-after-2027';
import type { IKvalitetsvurderingAnkeITRAfter2027 } from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';
import { isKakaKvalitetsvurdering, isKantKvalitetsvurdering } from '@/types/kvalitetsvurdering/common';
import type { IKvalitetsvurderingV1 } from '@/types/kvalitetsvurdering/v1';
import type { IKvalitetsvurdering as IKvalitetsvurderingV2 } from '@/types/kvalitetsvurdering/v2';
import type { IKvalitetsvurdering as IKvalitetsvurderingV3 } from '@/types/kvalitetsvurdering/v3';
import { type IOppgavebehandling, KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

export type IKvalitetsvurdering =
  | IKvalitetsvurderingV3
  | IKvalitetsvurderingV2
  | IKvalitetsvurderingV1
  | IKvalitetsvurderingAnkeAfter2027
  | IKvalitetsvurderingAnkeITRAfter2027;

export const useKvalitetsvurdering = (): [IKvalitetsvurdering | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data: v1, isLoading: v1loading } = useGetKvalitetsvurderingQueryV1(
    getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V1),
  );
  const { data: v2, isLoading: v2loading } = useGetKvalitetsvurderingQueryV2(
    getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V2),
  );
  const { data: v3, isLoading: v3loading } = useGetKvalitetsvurderingQueryV3(
    getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V3),
  );
  const { data: ankeAfter2027, isLoading: ankeAfter2027Loading } = useGetKvalitetsvurderingQueryAnkeAfter2027(
    getIdOrSkipTokenForKant(oppgave, SaksTypeEnum.ANKE_AFTER_2027),
  );
  const { data: ankeITRAfter2027, isLoading: ankeITRAfter2027Loading } = useGetKvalitetsvurderingQueryAnkeITRAfter2027(
    getIdOrSkipTokenForKant(oppgave, SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027),
  );

  return [
    v3 ?? v2 ?? v1 ?? ankeAfter2027 ?? ankeITRAfter2027,
    v3loading || v2loading || v1loading || ankeAfter2027Loading || ankeITRAfter2027Loading,
  ];
};

export const useKvalitetsvurderingV1 = (): [IKvalitetsvurderingV1 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data, isLoading } = useGetKvalitetsvurderingQueryV1(
    getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V1),
  );

  return [data, isLoading];
};

export const useKvalitetsvurderingV2 = (): [IKvalitetsvurderingV2 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data, isLoading } = useGetKvalitetsvurderingQueryV2(
    getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V2),
  );

  return [data, isLoading];
};

export const useKvalitetsvurderingV3 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryV3(getIdOrSkipTokenForKaka(oppgave, KvalitetsvurderingVersion.V3));
};

export const useKvalitetsvurderingAnkeAfter2027 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryAnkeAfter2027(getIdOrSkipTokenForKant(oppgave, SaksTypeEnum.ANKE_AFTER_2027));
};

export const useKvalitetsvurderingAnkeITRAfter2027 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryAnkeITRAfter2027(
    getIdOrSkipTokenForKant(oppgave, SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027),
  );
};

const getIdOrSkipTokenForKaka = (
  oppgave: IOppgavebehandling | undefined,
  requiredVersion: KvalitetsvurderingVersion,
): string | typeof skipToken => {
  if (oppgave === undefined || !isKakaKvalitetsvurdering(oppgave)) {
    return skipToken;
  }

  if (oppgave.kvalitetsvurderingReference.version !== requiredVersion) {
    return skipToken;
  }

  return oppgave.kvalitetsvurderingReference.id;
};

const getIdOrSkipTokenForKant = (
  oppgave: IOppgavebehandling | undefined,
  sakstype: SaksTypeEnum,
): string | typeof skipToken => {
  if (oppgave === undefined || !isKantKvalitetsvurdering(oppgave)) {
    return skipToken;
  }

  const { kantReference, typeId } = oppgave;

  if (kantReference === null || sakstype !== typeId) {
    return skipToken;
  }

  return kantReference;
};
