import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryAnkeAfter2027 } from '@/redux-api/kaka-kvalitetsvurdering/anke-after-2027';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryAnkeITRAfter2027 } from '@/redux-api/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV1 } from '@/redux-api/kaka-kvalitetsvurdering/v1';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV2 } from '@/redux-api/kaka-kvalitetsvurdering/v2';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV3 } from '@/redux-api/kaka-kvalitetsvurdering/v3';
import type { IKvalitetsvurderingAnkeAfter2027 } from '@/types/kaka-kvalitetsvurdering/anke-after-2027';
import type { IKvalitetsvurderingAnkeITRAfter2027 } from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import type { IKvalitetsvurderingV1 } from '@/types/kaka-kvalitetsvurdering/v1';
import type { IKvalitetsvurdering as IKvalitetsvurderingV2 } from '@/types/kaka-kvalitetsvurdering/v2';
import type { IKvalitetsvurdering as IKvalitetsvurderingV3 } from '@/types/kaka-kvalitetsvurdering/v3';
import {
  type KvalitetsvurderingReference,
  KvalitetsvurderingVersion,
} from '@/types/oppgavebehandling/oppgavebehandling';

export type IKvalitetsvurdering =
  | IKvalitetsvurderingV3
  | IKvalitetsvurderingV2
  | IKvalitetsvurderingV1
  | IKvalitetsvurderingAnkeAfter2027
  | IKvalitetsvurderingAnkeITRAfter2027;

export const useKvalitetsvurdering = (): [IKvalitetsvurdering | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data: v1, isLoading: v1loading } = useGetKvalitetsvurderingQueryV1(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V1),
  );
  const { data: v2, isLoading: v2loading } = useGetKvalitetsvurderingQueryV2(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V2),
  );
  const { data: v3, isLoading: v3loading } = useGetKvalitetsvurderingQueryV3(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V3),
  );
  const { data: ankeAfter2027, isLoading: ankeAfter2027Loading } = useGetKvalitetsvurderingQueryAnkeAfter2027(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.ANKE_AFTER_2027),
  );
  const { data: ankeITRAfter2027, isLoading: ankeITRAfter2027Loading } = useGetKvalitetsvurderingQueryAnkeITRAfter2027(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.ANKE_I_TRYGDERETTEN_AFTER_2027),
  );

  return [
    v3 ?? v2 ?? v1 ?? ankeAfter2027 ?? ankeITRAfter2027,
    v3loading || v2loading || v1loading || ankeAfter2027Loading || ankeITRAfter2027Loading,
  ];
};

export const useKvalitetsvurderingV1 = (): [IKvalitetsvurderingV1 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data, isLoading } = useGetKvalitetsvurderingQueryV1(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V1),
  );

  return [data, isLoading];
};

export const useKvalitetsvurderingV2 = (): [IKvalitetsvurderingV2 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data, isLoading } = useGetKvalitetsvurderingQueryV2(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V2),
  );

  return [data, isLoading];
};

export const useKvalitetsvurderingV3 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryV3(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V3),
  );
};

export const useKvalitetsvurderingAnkeAfter2027 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryAnkeAfter2027(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.ANKE_AFTER_2027),
  );
};

export const useKvalitetsvurderingAnkeITRAfter2027 = () => {
  const { data: oppgave } = useOppgave();

  return useGetKvalitetsvurderingQueryAnkeITRAfter2027(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.ANKE_I_TRYGDERETTEN_AFTER_2027),
  );
};

const getIdOrSkipToken = (
  ref: KvalitetsvurderingReference | undefined | null,
  requiredVersion: KvalitetsvurderingVersion,
): string | typeof skipToken => {
  if (ref === undefined || ref === null || ref.version !== requiredVersion) {
    return skipToken;
  }

  return ref.id;
};
