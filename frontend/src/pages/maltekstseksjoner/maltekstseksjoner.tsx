import React from 'react';
import { MaltekstseksjonList } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list';
import { PageWrapper } from '../page-wrapper';

export const MaltekstseksjonerPage = () => (
  <PageWrapper>
    <MaltekstseksjonList />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default MaltekstseksjonerPage;
