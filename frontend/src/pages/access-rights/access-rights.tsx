import React from 'react';
import styled from 'styled-components';
import { AccessRights } from '@app/components/access-rights/access-rights';
import { PageWrapper, StyledArticle } from '../page-wrapper';

export const AccessRightsPage = () => (
  <PageWrapper>
    <AccessRightsArticle>
      <AccessRights />
    </AccessRightsArticle>
  </PageWrapper>
);

const AccessRightsArticle = styled(StyledArticle)`
  max-height: 100%;
  height: 100%;
  overflow: hidden;
`;

// eslint-disable-next-line import/no-default-export
export default AccessRightsPage;
