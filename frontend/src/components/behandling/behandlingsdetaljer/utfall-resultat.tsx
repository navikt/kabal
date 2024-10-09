import { HelpText, Label, Select, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { ReturWarning } from '@app/components/behandling/behandlingsdetaljer/retur-warning';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateExtraUtfallMutation, useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { UtfallEnum } from '@app/types/kodeverk';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
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
    <Container data-testid={CONTAINER_ID}>
      <HelpTextWrapper>
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Det utfallet som passet best for saken.</HelpText>
      </HelpTextWrapper>
      <Tag size="small" variant="alt1">
        {utfallName}
      </Tag>
    </Container>
  );
};

const EditUtfallResultat = ({ utfall, oppgaveId }: UtfallResultatProps) => {
  const [updateUtfall] = useUpdateUtfallMutation();
  const [updateEkstraUtfall] = useUpdateExtraUtfallMutation();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');
  const { data: oppgave } = useOppgave();

  const [utfallKodeverk, isLoading] = useUtfall(oppgave?.typeId);

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (typeof oppgaveId !== 'string') {
      return;
    }

    if (isUtfall(value)) {
      updateUtfall({ oppgaveId, utfallId: value });

      if (oppgave !== undefined && oppgave.resultat.extraUtfallIdSet.includes(value)) {
        updateEkstraUtfall({
          oppgaveId,
          extraUtfallIdSet: oppgave.resultat.extraUtfallIdSet.filter((id) => id !== value),
        });
      }
    } else if (value === NOT_SELECTED_VALUE) {
      // BE will handle extra utfall for this case
      updateUtfall({ oppgaveId, utfallId: null });
    }
  };

  const options = utfallKodeverk.map(({ id, navn }) => <option key={id} value={id} label={navn} />);

  return (
    <Container data-testid={CONTAINER_ID}>
      <HelpTextWrapper>
        <Label size="small" htmlFor={SELECT_ID}>
          {utfallLabel}
        </Label>
        <HelpText>Du kan kun velge ett utfall i saken. Velg det utfallet som passer best.</HelpText>
      </HelpTextWrapper>

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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const HelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
