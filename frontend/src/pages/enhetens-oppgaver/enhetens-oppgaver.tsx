import React from 'react';
import { EnhetensOppgaverTable } from '../../components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { OppgaverPageWrapper } from '../page-wrapper';

export const EnhetensOppgaverPage = () => {
  const { data } = useGetBrukerQuery();
  const tables = data?.enheter.map((enhet) => <EnhetensOppgaverTable enhet={enhet} key={enhet.id} />);

  return <OppgaverPageWrapper>{tables}</OppgaverPageWrapper>;
};
