import { BodyShort, Checkbox } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { useText } from '@/components/oppgavebehandling-footer/confirm-finish/use-text';
import { SaksTypeEnum } from '@/types/kodeverk';

interface Props {
  children: React.ReactNode;
}

export const ConfirmFinishInfo = ({ children }: Props) => {
  const text = useText();

  return (
    <Alert variant="info">
      <BodyShort size="small" spacing>
        {text}
      </BodyShort>

      {children}
    </Alert>
  );
};

interface ArenaConfirmationCheckboxProps {
  typeId: SaksTypeEnum;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

export const ArenaConfirmationCheckbox = ({ typeId, confirmed, setConfirmed }: ArenaConfirmationCheckboxProps) => (
  <Checkbox onChange={(e) => setConfirmed(e.target.checked)} checked={confirmed} size="small">
    {getArenaCheckboxText(typeId)}
  </Checkbox>
);

const getArenaCheckboxText = (typeId: SaksTypeEnum) => {
  if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return 'Jeg bekrefter at jeg har registrert utfallet fra Trygderetten i Arena';
  }

  if (
    typeId === SaksTypeEnum.KLAGE ||
    typeId === SaksTypeEnum.ANKE ||
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET
  ) {
    return 'Jeg bekrefter at saken er sendt til godkjenning i Arena.';
  }

  return 'Jeg bekrefter at saken er besluttet i Arena.';
};
