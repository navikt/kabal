import { ReturWarning } from '@app/components/behandling/behandlingsdetaljer/warnings';
import { FlatMultiSelectDropdown } from '@app/components/filter-dropdown/multi-select-dropdown';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUpdateExtraUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { type SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { HelpText, HStack, InlineMessage, Label, Tag, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';

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
    <VStack gap="2" marginBlock="0 4">
      {canEdit ? <ExtraUtfallButton {...props} /> : null}
      <Tags {...props} />
      {canEdit && includesRetur ? <ReturWarning /> : null}
    </VStack>
  );
};

const ExtraUtfallButton = ({ utfallIdSet, mainUtfall, oppgaveId, typeId }: Props) => {
  const [updateUtfall] = useUpdateExtraUtfallMutation();
  const [utfallKodeverk] = useUtfall(typeId);

  const options = useMemo(
    () =>
      utfallKodeverk.map(({ id, navn }) => ({
        value: id,
        label: navn,
        disabled: id === mainUtfall,
      })),
    [utfallKodeverk, mainUtfall],
  );

  const selected = useMemo(() => {
    if (mainUtfall === null) {
      return utfallIdSet;
    }

    return utfallIdSet.includes(mainUtfall) ? utfallIdSet : [...utfallIdSet, mainUtfall];
  }, [utfallIdSet, mainUtfall]);

  const disabled = mainUtfall === null;

  return (
    <HStack align="center" gap="2" wrap={false}>
      {disabled ? (
        <InlineMessage status="info">
          Du må velge utfall/resultat før du kan sette ekstra utfall for tilpasset tekst.
        </InlineMessage>
      ) : (
        <FlatMultiSelectDropdown
          selected={selected}
          options={options}
          onChange={(newList) => updateUtfall({ oppgaveId, extraUtfallIdSet: newList.filter(isUtfall) })}
          showCounter={false}
          variant="secondary-neutral"
        >
          Ekstra utfall for tilpasset tekst
        </FlatMultiSelectDropdown>
      )}

      <HelpText>Her kan du velge flere utfall for å få opp maltekst som passer til flere utfall.</HelpText>
    </HStack>
  );
};

const ReadOnlyLabel = () => {
  const canEdit = useCanEditBehandling();

  if (canEdit) {
    return null;
  }

  return (
    <HStack align="center" gap="2">
      <Label htmlFor={TAGSCONTAINER_ID} size="small">
        Ekstra utfall for tilpasset tekst
      </Label>
      <HelpText>
        <VStack width="300px">Valg av flere utfall for å få opp maltekst som passer til flere utfall.</VStack>
      </HelpText>
    </HStack>
  );
};

const TAGSCONTAINER_ID = 'tags-container';

const Tags = ({ utfallIdSet, mainUtfall, typeId }: TagsProps) => {
  const [utfallKodeverk] = useUtfall(typeId);
  const canEdit = useCanEditBehandling();

  return (
    <>
      <ReadOnlyLabel />
      <HStack wrap gap="1" marginBlock="1 0" id={TAGSCONTAINER_ID}>
        {mainUtfall === null || !canEdit ? null : (
          <Tag size="small" variant="alt1">
            {utfallKodeverk.find((u) => u.id === mainUtfall)?.navn ?? `Ukjent utfall (${mainUtfall})`} (hovedutfall)
          </Tag>
        )}
        {utfallIdSet.map((utfall) =>
          utfall === mainUtfall ? null : (
            <Tag key={utfall} size="small" variant="info">
              {utfallKodeverk.find((u) => u.id === utfall)?.navn ?? `Ukjent utfall (${utfall})`}
            </Tag>
          ),
        )}
      </HStack>
    </>
  );
};
