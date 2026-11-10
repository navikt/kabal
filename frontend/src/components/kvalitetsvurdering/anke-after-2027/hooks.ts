import { skipToken } from '@reduxjs/toolkit/query';
import { useContext, useMemo } from 'react';
import {
  MainReason,
  OmgjøringBoolean,
  type OmgjøringErrorFields,
  OmgjøringSaksdataHjemlerList,
  SaksbehandlingsfeilBoolean,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '@/redux-api/kaka-kvalitetsvurdering/anke-after-2027';
import type {
  IKvalitetsvurderingAnkeAfter2027,
  KvalitetsvurderingDataAnkeAfter2027,
} from '@/types/kaka-kvalitetsvurdering/anke-after-2027';
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
  kvalitetsvurdering: IKvalitetsvurderingAnkeAfter2027;
  update: (patch: Partial<KvalitetsvurderingDataAnkeAfter2027>) => Promise<IKvalitetsvurderingAnkeAfter2027>;
  isLoading: false;
}

const EMPTY_ARRAY: string[] = [];

export const useKvalitetsvurderingAnkeAfter2027State = (): Loading | Loaded => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess } = useOppgave();
  const id = oppgave?.kvalitetsvurderingReference?.id;
  const { data: kvalitetsvurdering, isSuccess: kvalitetsvurderingIsSuccess } = useGetKvalitetsvurderingQuery(
    id ?? skipToken,
  );
  const [update] = useUpdateKvalitetsvurderingMutation();

  // TODO: Remove fake state when backend is ready.
  if (oppgave !== undefined) {
    return {
      oppgave,
      hjemler: oppgave.resultat.hjemmelIdSet,
      kvalitetsvurdering: fakeState,
      update: (patch) => update({ ...patch, id: '' }).unwrap(),

      isLoading: false,
    };
  }

  if (
    !oppgaveIsSuccess ||
    !kvalitetsvurderingIsSuccess ||
    oppgave === undefined ||
    kvalitetsvurdering === undefined ||
    id === undefined
  ) {
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

type ValidationField = keyof KvalitetsvurderingDataAnkeAfter2027 | OmgjøringErrorFields;

export const useValidationError = (field: ValidationField): string | undefined => {
  const context = useContext(ValidationErrorContext);

  return useMemo(
    () => context.validationSectionErrors.flatMap((e) => e.properties).find((p) => p.field === field)?.reason,
    [context, field],
  );
};

const fakeState: IKvalitetsvurderingAnkeAfter2027 = {
  id: 'fake',
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  version: 4,
  [MainReason.OmgjøringIKlageomgangen]: null,
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList]: [],
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: [],
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]: false,
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: [],
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet]: false,
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet]: false,
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet]: false,
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet]: false,
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet]: false,
  [SaksbehandlingsfeilBoolean.klagevedtaketSkulleVærtBedreBegrunnet]: false,
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaBenyttetRådgivendeOverlege]: false,
};
