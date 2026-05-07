import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV1 } from '@/redux-api/kaka-kvalitetsvurdering/v1';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV2 } from '@/redux-api/kaka-kvalitetsvurdering/v2';
import { useGetKvalitetsvurderingQuery as useGetKvalitetsvurderingQueryV3 } from '@/redux-api/kaka-kvalitetsvurdering/v3';
import type { IKvalitetsvurderingV1 } from '@/types/kaka-kvalitetsvurdering/v1';
import type { IKvalitetsvurdering as IKvalitetsvurderingV2 } from '@/types/kaka-kvalitetsvurdering/v2';
import type { IKvalitetsvurdering as IKvalitetsvurderingV3 } from '@/types/kaka-kvalitetsvurdering/v3';
import {
  type KvalitetsvurderingReference,
  KvalitetsvurderingVersion,
} from '@/types/oppgavebehandling/oppgavebehandling';

export type IKvalitetsvurdering = IKvalitetsvurderingV3 | IKvalitetsvurderingV2 | IKvalitetsvurderingV1;

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

  return [v3 ?? v2 ?? v1, v3loading || v2loading || v1loading];
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

export const useKvalitetsvurderingV3 = (): [IKvalitetsvurderingV3 | undefined, boolean] => {
  const { data: oppgave } = useOppgave();

  const { data, isLoading } = useGetKvalitetsvurderingQueryV3(
    getIdOrSkipToken(oppgave?.kvalitetsvurderingReference, KvalitetsvurderingVersion.V3),
  );

  return [data, isLoading];
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
