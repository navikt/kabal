import {
  AnkeDelvisMedholdWarning,
  AnkeITRHenvistWarning,
  AnkeITROpphevetWarning,
  ReturWarning,
} from '@app/components/behandling/behandlingsdetaljer/warnings';
import { usePanelContainerRef } from '@app/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableSelect } from '@app/components/searchable-select/searchable-single-select/searchable-single-select';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateExtraUtfallMutation, useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { type IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { useId, useMemo } from 'react';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
  extraUtfallIdSet: UtfallEnum[];
  typeId: SaksTypeEnum;
}

const NOT_SELECTED_LABEL = 'Ikke valgt';
const CONTAINER_ID = 'utfall-section';

type UtfallEntry = IKodeverkSimpleValue<UtfallEnum>;

export const UtfallResultat = ({ utfall, oppgaveId, extraUtfallIdSet, typeId }: UtfallResultatProps) => {
  const containerRef = usePanelContainerRef();
  const canEdit = useCanEditBehandling();
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

  const selectId = useId();

  return (
    <VStack align="start" data-testid={CONTAINER_ID}>
      <HStack align="center" gap="space-8" marginBlock="space-0 space-8">
        <Label size="small" htmlFor={selectId}>
          {utfallLabel}
        </Label>

        <HelpText>Du kan kun velge ett utfall i saken. Velg det utfallet som passer best.</HelpText>
      </HStack>

      <SearchableSelect
        id={selectId}
        disabled={isLoading}
        label={utfallLabel}
        onChange={onUtfallChange}
        onClear={() => updateUtfall({ oppgaveId, utfallId: null })}
        value={selectedUtfall}
        options={utfallKodeverk}
        valueKey={utfallValueKey}
        formatLabel={utfallFormatLabel}
        filterOption={utfallFilterOption}
        error={validationError}
        confirmLabel="Sett utfall"
        scrollContainerRef={containerRef}
        readOnly={!canEdit}
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
