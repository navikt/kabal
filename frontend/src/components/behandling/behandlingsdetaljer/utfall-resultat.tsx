import {
  AnkeDelvisMedholdWarning,
  AnkeITRHenvistWarning,
  AnkeITROpphevetWarning,
  ReturWarning,
} from '@app/components/behandling/behandlingsdetaljer/warnings';
import { SearchableSelect } from '@app/components/searchable-select/searchable-select';
import { UtfallTag } from '@app/components/utfall-tag/utfall-tag';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateExtraUtfallMutation, useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { type IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
  extraUtfallIdSet: UtfallEnum[];
  typeId: SaksTypeEnum;
}

const NOT_SELECTED_LABEL = 'Ikke valgt';
const SELECT_ID = 'select-utfall';
const CONTAINER_ID = 'utfall-section';

export const UtfallResultat = (props: UtfallResultatProps) => {
  const canEdit = useCanEditBehandling();

  return canEdit ? <EditUtfallResultat {...props} /> : <ReadOnlyUtfall {...props} />;
};

const ReadOnlyUtfall = ({ utfall }: UtfallResultatProps) => {
  const utfallLabel = useFieldName('utfall');

  return (
    <VStack align="start" gap="space-8" marginBlock="space-0 space-1" data-testid={CONTAINER_ID}>
      <HStack align="center" gap="space-8">
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Det utfallet som passet best for saken.</HelpText>
      </HStack>
      <UtfallTag utfallId={utfall} size="small" fallback={NOT_SELECTED_LABEL} />
    </VStack>
  );
};

type UtfallEntry = IKodeverkSimpleValue<UtfallEnum>;

const EditUtfallResultat = ({ utfall, oppgaveId, extraUtfallIdSet, typeId }: UtfallResultatProps) => {
  const [updateUtfall] = useUpdateUtfallMutation();
  const [updateEkstraUtfall] = useUpdateExtraUtfallMutation();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');

  const [utfallKodeverk, isLoading] = useUtfall(typeId);

  const selectedUtfall = useMemo(
    () => (utfall === null ? null : (utfallKodeverk.find((u) => u.id === utfall) ?? null)),
    [utfall, utfallKodeverk],
  );

  const onUtfallChange = (entry: UtfallEntry) => {
    updateUtfall({ oppgaveId, utfallId: entry.id });

    if (extraUtfallIdSet.includes(entry.id)) {
      updateEkstraUtfall({ oppgaveId, extraUtfallIdSet: extraUtfallIdSet.filter((id) => id !== entry.id) });
    }
  };

  return (
    <VStack align="start" gap="space-8" marginBlock="space-0 space-1" data-testid={CONTAINER_ID}>
      <HStack align="center" gap="space-8">
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Du kan kun velge ett utfall i saken. Velg det utfallet som passer best.</HelpText>
      </HStack>

      <SearchableSelect
        disabled={isLoading}
        label={utfallLabel}
        size="small"
        onChange={onUtfallChange}
        onClear={() => updateUtfall({ oppgaveId, utfallId: null })}
        value={selectedUtfall}
        options={utfallKodeverk}
        valueKey={utfallValueKey}
        formatLabel={utfallFormatLabel}
        filterOption={utfallFilterOption}
        error={validationError}
        confirmLabel="Sett utfall"
      />
      {utfall === UtfallEnum.RETUR ? <ReturWarning /> : null}
      {typeId === SaksTypeEnum.ANKE && utfall === UtfallEnum.DELVIS_MEDHOLD ? <AnkeDelvisMedholdWarning /> : null}
      {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && utfall === UtfallEnum.HENVIST ? <AnkeITRHenvistWarning /> : null}
      {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && utfall === UtfallEnum.OPPHEVET ? (
        <AnkeITROpphevetWarning />
      ) : null}
    </VStack>
  );
};

const utfallValueKey = (entry: UtfallEntry): string => entry.id;

const utfallFormatLabel = (entry: UtfallEntry | null): React.ReactNode =>
  entry === null ? NOT_SELECTED_LABEL : entry.navn;

const utfallFilterOption = (entry: UtfallEntry, search: string): boolean =>
  entry.navn.toLowerCase().includes(search.toLowerCase());
