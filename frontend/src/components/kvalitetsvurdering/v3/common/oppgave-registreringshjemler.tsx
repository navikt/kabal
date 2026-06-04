import { BodyShort, Box, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useKvalitetsvurderingV3State } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@/components/kvalitetsvurdering/v3/common/use-validation-error';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';
import type {
  KvalitetsvurderingSaksdataRegistreringshjemlerV3,
  KvalitetsvurderingV3Boolean,
} from '@/types/kaka-kvalitetsvurdering/v3';

interface SaksdatahjemlerProps {
  field: keyof KvalitetsvurderingSaksdataRegistreringshjemlerV3;
  parentKey?: keyof KvalitetsvurderingV3Boolean;
}

export const OppgaveRegistreringshjemler = ({ field, parentKey }: SaksdatahjemlerProps) => {
  const { hjemler, kvalitetsvurdering, update, isLoading } = useKvalitetsvurderingV3State();
  const { data: registreringshjemlerMap, isLoading: registreringshjemlerMapIsLoading } = useRegistreringshjemlerMap();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(field);

  if (isLoading || registreringshjemlerMapIsLoading || typeof registreringshjemlerMap === 'undefined') {
    return null;
  }

  const show = parentKey === undefined || kvalitetsvurdering[parentKey];

  if (!show) {
    return null;
  }

  const onChange = (newHjemler: string[]) => {
    if (hjemler.length === 1) {
      return;
    }
    update({ [field]: newHjemler });
  };

  const value = kvalitetsvurdering[field];

  return (
    <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
      <CheckboxGroup
        size="small"
        legend="Hjemler"
        onChange={onChange}
        value={value}
        disabled={!canEdit}
        error={validationError}
        id={field}
      >
        <HjemmelCheckboxes hjemmelIdList={hjemler} />
      </CheckboxGroup>
    </Box>
  );
};

interface HjemmelCheckboxesProps {
  hjemmelIdList: string[];
}

const HjemmelCheckboxes = ({ hjemmelIdList }: HjemmelCheckboxesProps) => {
  const { data: registreringshjemlerMap, isLoading } = useRegistreringshjemlerMap();

  if (hjemmelIdList.length === 0 || isLoading || typeof registreringshjemlerMap === 'undefined') {
    return <BodyShort className="italic">Ingen hjemler valgt under saksdata.</BodyShort>;
  }

  return (
    <>
      {hjemmelIdList.map((hjemmelId) => (
        <Checkbox key={hjemmelId} value={hjemmelId}>
          {registreringshjemlerMap[hjemmelId]?.hjemmelnavn ?? hjemmelId}
        </Checkbox>
      ))}
    </>
  );
};
