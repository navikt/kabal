import { HjemmelList } from '@app/components/oppgavebehandling-footer/deassign/hjemmel-list';
import { useFradel } from '@app/components/oppgavestyring/use-tildel';
import { areArraysEqual } from '@app/functions/are-arrays-equal';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FradelReason, FradelReasonText } from '@app/types/oppgaver';
import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
import { Direction } from './direction';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  ytelseId: string;
  hjemmelIdList: string[];
  close: () => void;
  direction: Direction;
  redirect?: boolean;
}

export const Popup = ({ oppgaveId, typeId, ytelseId, hjemmelIdList, close, direction, redirect = false }: Props) => {
  const navigate = useNavigate();
  const [reasonId, setReasonId] = useState<FradelReason | null>(null);
  const [selectedHjemmelIdList, setSelectedHjemmelIdList] = useState<string[]>(hjemmelIdList);
  const [fradel, { isLoading }] = useFradel(oppgaveId, typeId, ytelseId);
  const [hjemmelError, setHjemmelError] = useState<string | null>(null);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const onClick = useCallback(async () => {
    if (reasonId === null) {
      return;
    }

    if (reasonId === FradelReason.FEIL_HJEMMEL) {
      if (selectedHjemmelIdList.length === 0) {
        setHjemmelError('Du må velge minst én hjemmel.');

        return;
      }

      if (areArraysEqual(selectedHjemmelIdList, hjemmelIdList)) {
        setHjemmelError('Du må endre hjemler.');

        return;
      }

      const success = await fradel({ reasonId, hjemmelIdList: selectedHjemmelIdList });

      if (redirect && success) {
        navigate('/mineoppgaver');
      }

      return;
    }

    const success = await fradel({ reasonId });

    if (redirect && success) {
      navigate('/mineoppgaver');
    }
  }, [reasonId, fradel, redirect, selectedHjemmelIdList, hjemmelIdList, navigate]);

  return (
    <StyledPopup
      style={{ [direction === Direction.UP ? 'bottom' : 'top']: '100%' }}
      data-testid="deassign-oppgave-popup"
    >
      <RadioGroup value={reasonId} onChange={setReasonId} legend="Årsak for å legge tilbake" size="small">
        <Radio value={FradelReason.FEIL_HJEMMEL}>{FradelReasonText[FradelReason.FEIL_HJEMMEL]}</Radio>
        <Radio value={FradelReason.MANGLER_KOMPETANSE}>{FradelReasonText[FradelReason.MANGLER_KOMPETANSE]}</Radio>
        <Radio value={FradelReason.INHABIL}>{FradelReasonText[FradelReason.INHABIL]}</Radio>
        <Radio value={FradelReason.LENGRE_FRAVÆR}>{FradelReasonText[FradelReason.LENGRE_FRAVÆR]}</Radio>
        <Radio value={FradelReason.ANNET}>{FradelReasonText[FradelReason.ANNET]}</Radio>
        {hasOppgavestyringRole ? (
          <Radio value={FradelReason.LEDER}>{FradelReasonText[FradelReason.LEDER]}</Radio>
        ) : null}
      </RadioGroup>
      {reasonId === FradelReason.FEIL_HJEMMEL ? (
        <HjemmelList
          selected={selectedHjemmelIdList}
          onChange={setSelectedHjemmelIdList}
          ytelseId={ytelseId}
          direction={direction}
          error={hjemmelError}
        />
      ) : null}

      <ButtonContainer>
        <Button variant="secondary" size="small" disabled={isLoading} onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>

        <Button
          variant="primary"
          size="small"
          loading={isLoading}
          onClick={onClick}
          icon={<FolderFileIcon aria-hidden />}
          disabled={reasonId === null}
          title={reasonId === null ? 'Velg årsak' : undefined}
        >
          Legg tilbake
        </Button>
      </ButtonContainer>
    </StyledPopup>
  );
};

const StyledPopup = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  gap: var(--a-spacing-2);
  width: 280px;
  padding: var(--a-spacing-4);

  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-divider);
  box-shadow: 0 0 var(--a-spacing-1) rgba(0, 0, 0, 0.25);
  z-index: 10;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: var(--a-spacing-2);
`;
