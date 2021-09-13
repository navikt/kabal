import React from 'react';
import { useParams } from 'react-router-dom';
import { OppgaveTable } from '../../components/oppgavetabell/oppgavetabell';

interface OppgaverPageProps {
  page: string;
}

export const OppgaverPage: React.FC = () => {
  const { page } = useParams<OppgaverPageProps>();

  return <OppgaveTable page={page} />;
};
