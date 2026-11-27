import { BodyShort, Box, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { getHjemlerValidationField } from '@/components/kvalitetsvurdering/anke-after-2027/data';
import {
  useKvalitetsvurderingAnkeAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';
import type { OmgjøringHjemlerField } from '@/types/kvalitetsvurdering/anke-after-2027';

interface Props {
  field: OmgjøringHjemlerField;
}

export const OmgjøringHjemler = ({ field }: Props) => {
  const validationField = getHjemlerValidationField(field);
  const { hjemler, kvalitetsvurdering, update, isSuccess } = useKvalitetsvurderingAnkeAfter2027State();
  const { data: registreringshjemlerMap } = useRegistreringshjemlerMap();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(validationField);

  if (!isSuccess || registreringshjemlerMap === undefined) {
    return null;
  }

  const { omgjortIKlageomgangen } = kvalitetsvurdering;

  const onChange = (newHjemler: string[]) => {
    if (hjemler.length === 1) {
      return;
    }

    update({
      omgjortIKlageomgangen: {
        ...omgjortIKlageomgangen,
        [field]: { ...omgjortIKlageomgangen[field], registreringshjemler: newHjemler },
      },
    });
  };

  return (
    <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
      <CheckboxGroup
        size="small"
        legend="Hjemler"
        onChange={onChange}
        value={omgjortIKlageomgangen[field].registreringshjemler}
        disabled={!canEdit}
        error={validationError}
        id={validationField}
      >
        {hjemler.length === 0 ? (
          <BodyShort className="italic">Ingen hjemler valgt under saksdata.</BodyShort>
        ) : (
          hjemler.map((hjemmelId) => (
            <Checkbox key={hjemmelId} value={hjemmelId}>
              {registreringshjemlerMap[hjemmelId]?.hjemmelnavn ?? hjemmelId}
            </Checkbox>
          ))
        )}
      </CheckboxGroup>
    </Box>
  );
};
