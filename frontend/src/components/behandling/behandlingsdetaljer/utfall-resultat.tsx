import { HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { useCallback, useId, useMemo } from 'react';
import {
  AnkeDelvisMedholdWarning,
  AnkeITRHenvistWarning,
  AnkeITROpphevetWarning,
  ReturWarning,
} from '@/components/behandling/behandlingsdetaljer/warnings';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useUtfall } from '@/hooks/use-utfall';
import { useValidationError } from '@/hooks/use-validation-error';
import { useUpdateExtraUtfallMutation, useUpdateUtfallMutation } from '@/redux-api/oppgaver/mutations/set-utfall';
import { type IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
  extraUtfallIdSet: UtfallEnum[];
  typeId: SaksTypeEnum;
}

const NOT_SELECTED_LABEL = 'Ikke valgt';
const NULL_UTFALL_KEY = '__no_utfall__';

type UtfallEntry = IKodeverkSimpleValue<UtfallEnum>;

export const UtfallResultat = ({ utfall, oppgaveId, extraUtfallIdSet, typeId }: UtfallResultatProps) => {
  const containerRef = usePanelContainerRef();
  const canEdit = useCanEditBehandling();
  const [updateUtfall] = useUpdateUtfallMutation();
  const [updateEkstraUtfall] = useUpdateExtraUtfallMutation();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');

  const [utfallKodeverk, isLoading] = useUtfall(typeId);

  const options = useMemo((): Entry<UtfallEntry | null>[] => {
    const entries: Entry<UtfallEntry | null>[] = [
      { value: null, key: NULL_UTFALL_KEY, plainText: NOT_SELECTED_LABEL, label: NOT_SELECTED_LABEL },
    ];

    for (const u of utfallKodeverk) {
      entries.push({
        value: u,
        key: u.id,
        plainText: u.navn,
        label: u.navn,
      });
    }

    return entries;
  }, [utfallKodeverk]);

  const selectedEntry = useMemo((): Entry<UtfallEntry | null> | null => {
    if (utfall === null) {
      return null;
    }

    return options.find((o) => o.key === utfall) ?? null;
  }, [utfall, options]);

  const onUtfallChange = useCallback(
    (entry: UtfallEntry | null) => {
      if (entry === null) {
        updateUtfall({ oppgaveId, utfallId: null });
        return;
      }

      updateUtfall({ oppgaveId, utfallId: entry.id });

      if (extraUtfallIdSet.includes(entry.id)) {
        updateEkstraUtfall({ oppgaveId, extraUtfallIdSet: extraUtfallIdSet.filter((id) => id !== entry.id) });
      }
    },
    [oppgaveId, extraUtfallIdSet, updateUtfall, updateEkstraUtfall],
  );

  const selectId = useId();

  return (
    <VStack as="section" align="start" aria-label={utfallLabel}>
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
        value={selectedEntry}
        options={options}
        nullLabel={NOT_SELECTED_LABEL}
        error={validationError}
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
