import { useContext, useMemo } from 'react';
import { ValidationErrorContext } from '../components/kvalitetsvurdering/validation-error-context';
import { IKakaKvalitetsvurdering } from '../types/kaka-kvalitetsvurdering';
import { IOppgavebehandlingBase, ITrygderettsankebehandling } from '../types/oppgavebehandling/oppgavebehandling';

type Field =
  | keyof IKakaKvalitetsvurdering
  | keyof Pick<IOppgavebehandlingBase, 'mottattKlageinstans'>
  | keyof Pick<IOppgavebehandlingBase, 'mottattVedtaksinstans'>
  | keyof Pick<ITrygderettsankebehandling, 'kjennelseMottatt'>
  | keyof Pick<ITrygderettsankebehandling, 'sendtTilTrygderetten'>
  | 'utfall'
  | 'hjemmel'
  | 'dokument';

export const useValidationError = (field: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  const allProperties = useMemo(
    () => context?.validationSectionErrors?.flatMap(({ properties }) => properties),
    [context]
  );

  return useMemo(() => allProperties?.find((p) => p.field === field)?.reason, [allProperties, field]);
};
