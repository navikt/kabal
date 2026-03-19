import { HelpText, HStack, InlineMessage, Label, VStack } from '@navikt/ds-react';
import { useCallback, useId, useMemo } from 'react';
import { ReturWarning } from '@/components/behandling/behandlingsdetaljer/warnings';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { isUtfall } from '@/functions/is-utfall';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useUtfall } from '@/hooks/use-utfall';
import { useUpdateExtraUtfallMutation } from '@/redux-api/oppgaver/mutations/set-utfall';
import { type IKodeverkSimpleValue, type SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

interface TagsProps {
  utfallIdSet: UtfallEnum[];
  mainUtfall: UtfallEnum | null;
  typeId: SaksTypeEnum;
}

interface Props extends TagsProps {
  oppgaveId: string;
}

export const ExtraUtfall = (props: Props) => {
  const canEdit = useCanEditBehandling();
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const includesRetur = oppgave.resultat.extraUtfallIdSet.some((u) => u === UtfallEnum.RETUR);

  return (
    <VStack gap="space-8" marginBlock="space-0 space-1">
      {canEdit ? <ExtraUtfallButton {...props} /> : null}
      {canEdit && includesRetur ? <ReturWarning /> : null}
    </VStack>
  );
};

const ExtraUtfallButton = ({ utfallIdSet, mainUtfall, oppgaveId, typeId }: Props) => {
  const containerRef = usePanelContainerRef();
  const [updateUtfall] = useUpdateExtraUtfallMutation();
  const [utfallKodeverk] = useUtfall(typeId);

  const options = useMemo(() => utfallKodeverk.filter(({ id }) => id !== mainUtfall), [utfallKodeverk, mainUtfall]);

  const value = useMemo(() => options.filter(({ id }) => utfallIdSet.includes(id)), [options, utfallIdSet]);

  const onChange = useCallback(
    (selected: IKodeverkSimpleValue<UtfallEnum>[]) => {
      const selectedIds = selected.map(({ id }) => id).filter(isUtfall);
      const extraUtfallIdSet = mainUtfall !== null ? [...new Set([mainUtfall, ...selectedIds])] : selectedIds;
      updateUtfall({ oppgaveId, extraUtfallIdSet });
    },
    [mainUtfall, oppgaveId, updateUtfall],
  );

  const selectId = useId();

  const disabled = mainUtfall === null;

  return (
    <VStack align="start">
      <HStack align="center" gap="space-8" marginBlock="space-0 space-8">
        <Label size="small" htmlFor={selectId}>
          Ekstra utfall for tilpasset tekst
        </Label>

        <HelpText>Her kan du velge flere utfall for å få opp maltekst som passer til flere utfall.</HelpText>
      </HStack>

      {disabled ? (
        <InlineMessage status="info">
          Du må velge utfall/resultat før du kan sette ekstra utfall for tilpasset tekst.
        </InlineMessage>
      ) : (
        <SearchableMultiSelect
          id={selectId}
          label="Ekstra utfall for tilpasset tekst"
          options={options}
          value={value}
          valueKey={utfallValueKey}
          formatOption={formatUtfallOption}
          emptyLabel="Velg ekstra utfall"
          filterText={utfallFilterText}
          onChange={onChange}
          scrollContainerRef={containerRef}
        />
      )}
    </VStack>
  );
};

const utfallValueKey = (option: IKodeverkSimpleValue<UtfallEnum>): string => option.id;
const formatUtfallOption = (option: IKodeverkSimpleValue<UtfallEnum>) => option.navn;
const utfallFilterText = (option: IKodeverkSimpleValue<UtfallEnum>): string => option.navn;
