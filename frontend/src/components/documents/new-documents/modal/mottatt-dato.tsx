import { skipToken } from '@reduxjs/toolkit/query';
import { parseISO } from 'date-fns';
import React, { useMemo } from 'react';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useSetDatoMottattMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { IFileDocument } from '@app/types/documents/documents';

interface Props {
  document: IFileDocument;
  oppgaveId: string | typeof skipToken;
}

export const MottattDato = ({ document, oppgaveId }: Props) => {
  const [setDatoMottatt, { isLoading }] = useSetDatoMottattMutation();

  const dokumentId = document.id;
  const value = useMemo(
    () => (document.datoMottatt === null ? new Date() : parseISO(document.datoMottatt) ?? new Date()),
    [document.datoMottatt],
  );

  return (
    <DatePicker
      size="small"
      label="NAV mottattdato"
      value={value}
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
