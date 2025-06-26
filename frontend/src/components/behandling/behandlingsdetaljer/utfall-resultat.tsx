import { AnkeDelvisMedholWarning, ReturWarning } from '@app/components/behandling/behandlingsdetaljer/warnings';
import { isUtfall } from '@app/functions/is-utfall';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateExtraUtfallMutation, useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { HelpText, HStack, Label, Select, Tag, VStack } from '@navikt/ds-react';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
  extraUtfallIdSet: UtfallEnum[];
  typeId: SaksTypeEnum;
}

const NOT_SELECTED_VALUE = 'NOT_SELECTED';
const NOT_SELECTED_LABEL = 'Ikke valgt';
const SELECT_ID = 'select-utfall';
const CONTAINER_ID = 'utfall-section';

export const UtfallResultat = (props: UtfallResultatProps) => {
  const canEdit = useCanEditBehandling();

  return canEdit ? <EditUtfallResultat {...props} /> : <ReadOnlyUtfall {...props} />;
};

const ReadOnlyUtfall = ({ utfall }: UtfallResultatProps) => {
  const utfallLabel = useFieldName('utfall');
  const utfallName = useUtfallNameOrLoading(utfall ?? NOT_SELECTED_LABEL);

  return (
    <VStack align="start" gap="2" marginBlock="0 4" data-testid={CONTAINER_ID}>
      <HStack align="center" gap="2">
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Det utfallet som passet best for saken.</HelpText>
      </HStack>
      <Tag size="small" variant="alt1">
        {utfallName}
      </Tag>
    </VStack>
  );
};

const EditUtfallResultat = ({ utfall, oppgaveId, extraUtfallIdSet, typeId }: UtfallResultatProps) => {
  const [updateUtfall] = useUpdateUtfallMutation();
  const [updateEkstraUtfall] = useUpdateExtraUtfallMutation();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');

  const [utfallKodeverk, isLoading] = useUtfall(typeId);

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (isUtfall(value)) {
      updateUtfall({ oppgaveId, utfallId: value });

      if (extraUtfallIdSet.includes(value)) {
        updateEkstraUtfall({ oppgaveId, extraUtfallIdSet: extraUtfallIdSet.filter((id) => id !== value) });
      }
    } else if (value === NOT_SELECTED_VALUE) {
      // BE will handle extra utfall for this case
      updateUtfall({ oppgaveId, utfallId: null });
    }
  };

  const options = utfallKodeverk.map(({ id, navn }) => <option key={id} value={id} label={navn} />);

  return (
    <VStack align="start" gap="2" marginBlock="0 4" data-testid={CONTAINER_ID}>
      <HStack align="center" gap="2">
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Du kan kun velge ett utfall i saken. Velg det utfallet som passer best.</HelpText>
      </HStack>

      <Select
        disabled={isLoading}
        label={utfallLabel}
        hideLabel
        size="small"
        onChange={onUtfallResultatChange}
        value={utfall ?? NOT_SELECTED_VALUE}
        id={SELECT_ID}
        data-testid={SELECT_ID}
        data-ready={!isLoading}
        error={validationError}
      >
        <option value={NOT_SELECTED_VALUE} label={NOT_SELECTED_LABEL} />
        {options}
      </Select>
      {utfall === UtfallEnum.RETUR ? <ReturWarning /> : null}
      {typeId === SaksTypeEnum.ANKE && utfall === UtfallEnum.DELVIS_MEDHOLD ? <AnkeDelvisMedholWarning /> : null}
    </VStack>
  );
};
