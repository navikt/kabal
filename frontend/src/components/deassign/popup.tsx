import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
import { HjemmelList } from '@app/components/oppgavebehandling-footer/deassign/hjemmel-list';
import { useFradel } from '@app/components/oppgavestyring/use-tildel';
import { areArraysEqual } from '@app/functions/are-arrays-equal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { FradelReason, FradelReasonText } from '@app/types/oppgaver';
import { Direction } from './direction';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  ytelseId: string;
  close: () => void;
  direction: Direction;
  redirect?: boolean;
}

export const Popup = (props: Props) => {
  const { data, isLoading } = useOppgave(props.oppgaveId);

  if (isLoading || data === undefined) {
    return null;
  }

  return <LoadedPopup {...props} oppgave={data} />;
};

interface LoadedPopupProps extends Props {
  oppgave: IOppgavebehandling;
}

const LoadedPopup = ({
  oppgave,
  oppgaveId,
  typeId,
  ytelseId,
  close,
  direction,
  redirect = false,
}: LoadedPopupProps) => {
  const navigate = useNavigate();
  const [reasonId, setReasonId] = useState<FradelReason | null>(null);
  const [hjemmelIdList, setHjemmelIdList] = useState<string[]>(oppgave.hjemmelIdList);
  const [fradel, { isLoading }] = useFradel(oppgaveId, typeId, ytelseId);
  const [hjemmelError, setHjemmelError] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    if (reasonId === null) {
      return;
    }

    if (reasonId === FradelReason.FEIL_HJEMMEL) {
      if (hjemmelIdList.length === 0) {
        setHjemmelError('Du må velge minst én hjemmel.');

        return;
      }

      if (areArraysEqual(hjemmelIdList, oppgave.hjemmelIdList)) {
        setHjemmelError('Du må endre hjemler.');

        return;
      }

      const success = await fradel({ reasonId, hjemmelIdList });

      if (redirect && success) {
        navigate('/mineoppgaver');
      }

      return;
    }

    const success = await fradel({ reasonId });

    if (redirect && success) {
      navigate('/mineoppgaver');
    }
  }, [fradel, hjemmelIdList, navigate, oppgave.hjemmelIdList, reasonId, redirect]);

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
      </RadioGroup>
      {reasonId === FradelReason.FEIL_HJEMMEL ? (
        <HjemmelList
          selected={hjemmelIdList}
          onChange={setHjemmelIdList}
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
  gap: 8px;
  width: 280px;
  padding: var(--a-spacing-4);

  background-color: white;
  border-radius: var(--a-border-radius-medium);
  border: 1px solid #c6c2bf;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;
