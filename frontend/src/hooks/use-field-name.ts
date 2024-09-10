import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { FIELD_NAMES, type Field } from '@app/types/field-names';

export const useFieldName = (field: Field): string => {
  const { data } = useOppgave();

  if (data === undefined) {
    return '';
  }

  return FIELD_NAMES[data.typeId][field] ?? field;
};
