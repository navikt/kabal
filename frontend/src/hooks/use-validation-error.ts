import { useContext, useMemo } from 'react';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import type { IKvalitetsvurderingV1 } from '@/types/kaka-kvalitetsvurdering/v1';
import type { IOppgavebehandlingBase, ITrygderettsankebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

type Field =
  | keyof IKvalitetsvurderingV1
  | keyof Pick<IOppgavebehandlingBase, 'mottattKlageinstans'>
  | keyof Pick<IOppgavebehandlingBase, 'mottattVedtaksinstans'>
  | keyof Pick<ITrygderettsankebehandling, 'kjennelseMottatt'>
  | keyof Pick<ITrygderettsankebehandling, 'sendtTilTrygderetten'>
  | keyof Pick<ITrygderettsankebehandling, 'trygderettenSaksnummer'>
  | 'utfall'
  | 'hjemmel'
  | 'underArbeid'
  | 'ignoreGosysOppgave'
  | 'gosysOppgaveUpdate';

export const useValidationError = (field: Field): string | undefined => {
  const context = useContext(ValidationErrorContext);

  const allProperties = useMemo(
    () => context?.validationSectionErrors?.flatMap(({ properties }) => properties),
    [context],
  );

  return useMemo(() => allProperties?.find((p) => p.field === field)?.reason, [allProperties, field]);
};
