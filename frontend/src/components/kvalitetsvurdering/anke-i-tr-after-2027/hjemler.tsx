import { BodyShort, Box, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { getHjemlerValidationField } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';
import type { OmgjøringHjemlerField } from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

interface Props {
  field: OmgjøringHjemlerField;
}

export const OmgjøringHjemler = ({ field }: Props) => {
  const validationField = getHjemlerValidationField(field);
  const { hjemler, kvalitetsvurdering, update, isSuccess } = useKvalitetsvurderingAnkeITRAfter2027State();
  const { data: registreringshjemlerMap } = useRegistreringshjemlerMap();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(validationField);

  if (!isSuccess || registreringshjemlerMap === undefined) {
    return null;
  }

  const { omgjortIAnkeomgangen } = kvalitetsvurdering;
  const selector = omgjortIAnkeomgangen[field];

  const onChange = (newHjemler: string[]) => {
    if (hjemler.length === 1) {
      return;
    }

    update({
      omgjortIAnkeomgangen: {
        ...omgjortIAnkeomgangen,
        [field]: { ...selector, registreringshjemler: newHjemler },
      },
    });
  };

  return (
    <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
      <CheckboxGroup
        size="small"
        legend="Hjemler"
        onChange={onChange}
        value={selector.registreringshjemler}
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
