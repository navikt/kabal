import { BodyShort, Heading, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { PageWrapper } from '@app/pages/page-wrapper';

export const NotFoundPage = () => (
  <PageWrapper>
    <Heading level="1" size="medium">
      Siden finnes ikke
    </Heading>
    <BodyShort>
      Siden <Path /> finnes ikke.
    </BodyShort>
  </PageWrapper>
);

const Path = () => (
  <Tag variant="neutral-moderate" size="xsmall">
    <StyledPre>{window.location.pathname}</StyledPre>
  </Tag>
);

const StyledPre = styled.pre`
  margin: 0;
`;
