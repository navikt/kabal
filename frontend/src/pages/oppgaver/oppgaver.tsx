import React from 'react';
import { useParams } from 'react-router-dom';
import { OppgaveTable } from '../../components/oppgavetabell/oppgave-table';
import { OppgaverPageWrapper } from '../page-wrapper';

interface OppgaverPageProps {
  page: string;
}

export const OppgaverPage: React.FC = () => {
  const { page } = useParams<OppgaverPageProps>();

  return (
    <OppgaverPageWrapper>
      <OppgaveTable page={page} />
    </OppgaverPageWrapper>
  );
};
