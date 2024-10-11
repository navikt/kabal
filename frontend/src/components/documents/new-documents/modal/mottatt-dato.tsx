import { DatePicker } from '@app/components/date-picker/date-picker';
import { useSetDatoMottattMutation } from '@app/redux-api/oppgaver/mutations/documents';
import type { IFileDocument } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  document: IFileDocument;
  oppgaveId: string | typeof skipToken;
}

export const MottattDato = ({ document, oppgaveId }: Props) => {
  const [setDatoMottatt, { isLoading }] = useSetDatoMottattMutation();

  const dokumentId = document.id;

  return (
    <DatePicker
      size="small"
      label="NAV mottattdato"
      value={document.datoMottatt}
      disabled={isLoading}
      onChange={(datoMottatt) => {
        if (oppgaveId === skipToken) {
          return;
        }

        if (datoMottatt === null) {
          return;
        }

        setDatoMottatt({
          datoMottatt,
          dokumentId,
          oppgaveId,
        });
      }}
    />
  );
};
