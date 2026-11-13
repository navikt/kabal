import { BodyShort, Box, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';
import type { KvalitetsvurderingAnkeITRAfter2027SaksdataHjemler } from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';

interface Props {
  field: keyof KvalitetsvurderingAnkeITRAfter2027SaksdataHjemler;
}

export const OmgjøringHjemler = ({ field }: Props) => {
  const { hjemler, kvalitetsvurdering, update, isSuccess } = useKvalitetsvurderingAnkeITRAfter2027State();
  const { data: registreringshjemlerMap } = useRegistreringshjemlerMap();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(field);

  if (!isSuccess || registreringshjemlerMap === undefined) {
    return null;
  }

  const onChange = (newHjemler: string[]) => {
    if (hjemler.length === 1) {
      return;
    }

    update({ [field]: newHjemler });
  };

  return (
    <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
      <CheckboxGroup
        size="small"
        legend="Hjemler"
        onChange={onChange}
        value={kvalitetsvurdering[field]}
        disabled={!canEdit}
        error={validationError}
        id={field}
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
