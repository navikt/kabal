import { skipToken } from '@reduxjs/toolkit/query';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useSetDatoMottattMutation } from '@/redux-api/oppgaver/mutations/documents';
import type { IFileDocumentOrAttachment } from '@/types/documents/documents';

interface Props {
  document: IFileDocumentOrAttachment;
  oppgaveId: string | typeof skipToken;
}

export const MottattDato = ({ document, oppgaveId }: Props) => {
  const [setDatoMottatt, { isLoading }] = useSetDatoMottattMutation();

  const dokumentId = document.id;

  return (
    <DatePicker
      size="small"
      label="Nav mottattdato"
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
