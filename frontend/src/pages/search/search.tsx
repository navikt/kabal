import React from 'react';
import { SearchBox } from '../../components/searchbox/searchbox';
import { OppgaverPageWrapper } from '../page-wrapper';

export const SearchPage: React.FC = () => (
  <OppgaverPageWrapper>
    <SearchBox onChange={() => {}} />
  </OppgaverPageWrapper>
);
