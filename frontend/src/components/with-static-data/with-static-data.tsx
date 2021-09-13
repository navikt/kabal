import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { IBruker, IEnhet, useGetBrukerQuery, useGetValgtEnhetQuery, useGetEnheterQuery } from '../../redux-api/bruker';
import { kodeverkApi } from '../../redux-api/kodeverk';
import { skipToken } from '@reduxjs/toolkit/query/react';

interface PageProps {
  bruker: IBruker;
  valgtEnhet: IEnhet;
  enheter: IEnhet[];
}

interface Props {
  PageComponent: React.FC<PageProps>;
}

export const WithStaticData: React.FC<Props> = ({ PageComponent }): JSX.Element => {
  const { data: bruker } = useGetBrukerQuery();
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.id ?? skipToken);
  const { data: enheter } = useGetEnheterQuery(bruker?.id ?? skipToken);
  kodeverkApi.usePrefetch('getKodeverk');

  if (typeof bruker === 'undefined') {
    return <Loader text={'Laster bruker...'} />;
  }

  if (typeof valgtEnhet === 'undefined') {
    return <Loader text={'Laster valgt enhet...'} />;
  }

  if (typeof enheter === 'undefined') {
    return <Loader text={'Laster enheter...'} />;
  }

  return <PageComponent bruker={bruker} valgtEnhet={valgtEnhet} enheter={enheter} />;
};

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => (
  <div>
    <NavFrontendSpinner />
    <span>{text}</span>
  </div>
);
