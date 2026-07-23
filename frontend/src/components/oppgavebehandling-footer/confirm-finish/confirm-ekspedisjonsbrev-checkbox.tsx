import { BodyShort, Checkbox } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';

interface Props {
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

export const ConfirmEkspedisjonsbrevCheckbox = ({ confirmed, setConfirmed }: Props) => (
  <Alert variant="warning">
    <BodyShort spacing size="small">
      Du har ikke sendt ekspedisjonsbrev til Trygderetten. Er du sikker på at du vil fullføre anken?
    </BodyShort>

    <Checkbox onChange={(e) => setConfirmed(e.target.checked)} checked={confirmed} size="small">
      Jeg bekrefter at jeg har sendt ekspedisjonsbrev til Trygderetten på en annen måte.
    </Checkbox>
  </Alert>
);
