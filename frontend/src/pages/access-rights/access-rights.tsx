import { AccessRights } from '@app/components/access-rights/access-rights';
import { styled } from 'styled-components';
import { PageWrapper } from '../page-wrapper';

export const AccessRightsPage = () => (
  <PageWrapper>
    <AccessRightsArticle>
      <AccessRights />
    </AccessRightsArticle>
  </PageWrapper>
);

const AccessRightsArticle = styled.article`
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
`;
