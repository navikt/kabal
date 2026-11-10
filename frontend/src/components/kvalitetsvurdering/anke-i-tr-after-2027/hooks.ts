import { skipToken } from '@reduxjs/toolkit/query';
import { useContext, useMemo } from 'react';
import {
  KjennelsensBetydningOgLæringsverdiFields,
  MainReason,
  OmgjøringBoolean,
  type OmgjøringErrorFields,
  OmgjøringSaksdataHjemlerList,
  RettensSammensetningFields,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '@/redux-api/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import type {
  IKvalitetsvurderingAnkeITRAfter2027,
  KvalitetsvurderingDataAnkeITRAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Loading {
  oppgave: undefined;
  hjemler: string[];
  kvalitetsvurdering: undefined;
  update: undefined;
  isLoading: true;
}

interface Loaded {
  oppgave: IOppgavebehandling;
  hjemler: string[];
  kvalitetsvurdering: IKvalitetsvurderingAnkeITRAfter2027;
  update: (patch: Partial<KvalitetsvurderingDataAnkeITRAfter2027>) => Promise<IKvalitetsvurderingAnkeITRAfter2027>;
  isLoading: false;
}

const EMPTY_ARRAY: string[] = [];

export const useKvalitetsvurderingAnkeITRAfter2027State = (): Loading | Loaded => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess } = useOppgave();
  const isAnkeITRAfter2027 = oppgave?.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027;
  const id = oppgave?.kvalitetsvurderingReference?.id;
  const { data: kvalitetsvurdering, isSuccess: kvalitetsvurderingIsSuccess } = useGetKvalitetsvurderingQuery(
    isAnkeITRAfter2027 && id !== undefined ? id : skipToken,
  );
  const [update] = useUpdateKvalitetsvurderingMutation();

  // TODO: Remove fake state when backend is ready.
  if (oppgaveIsSuccess) {
    return {
      oppgave,
      hjemler: oppgave.resultat.hjemmelIdSet,
      kvalitetsvurdering: fakeState,
      update: (patch) => update({ ...patch, id: '' }).unwrap(),
      isLoading: false,
    };
  }

  if (!oppgaveIsSuccess || !kvalitetsvurderingIsSuccess || id === undefined) {
    return {
      oppgave: undefined,
      hjemler: EMPTY_ARRAY,
      kvalitetsvurdering: undefined,
      update: undefined,
      isLoading: true,
    };
  }

  return {
    oppgave,
    hjemler: oppgave.resultat.hjemmelIdSet,
    kvalitetsvurdering,
    update: (patch) => update({ ...patch, id }).unwrap(),
    isLoading: false,
  };
};

type ValidationField = keyof KvalitetsvurderingDataAnkeITRAfter2027 | OmgjøringErrorFields;

export const useValidationError = (field: ValidationField): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(
    () => context.validationSectionErrors.flatMap((e) => e.properties).find((p) => p.field === field)?.reason,
    [context, field],
  );
};

const fakeState: IKvalitetsvurderingAnkeITRAfter2027 = {
  id: 'fake',
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  version: 4,
  [MainReason.OmgjøringIAnkeomgangen]: null,
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList]: [],
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: [],
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: [],
  [RettensSammensetningFields.hvilkenSammensetningHaddeRetten]: null,
  [RettensSammensetningFields.varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem]: null,
  [KjennelsensBetydningOgLæringsverdiFields.erKjennelsenAvsagtMedForenkletBegrunnelse]: null,
  [KjennelsensBetydningOgLæringsverdiFields.reiserKjennelsenEtPrinsipieltRettsspørsmål]: null,
  [KjennelsensBetydningOgLæringsverdiFields.bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten]: null,
  [KjennelsensBetydningOgLæringsverdiFields.harKjennelsenBetydningForFlereFagområder]: null,
  [KjennelsensBetydningOgLæringsverdiFields.inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]:
    null,
  [KjennelsensBetydningOgLæringsverdiFields.omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk]: null,
  [KjennelsensBetydningOgLæringsverdiFields.børKjennelsenDelesMedFagmiljøetSomLæringseksempel]: null,
};
