import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { FIELD_NAMES, type Field } from '@/types/field-names';

export const useFieldName = (field: Field): string => {
  const { data } = useOppgave();

  if (data === undefined) {
    return '';
  }

  return FIELD_NAMES[data.typeId][field] ?? field;
};
