import { PageWrapper } from '@app/pages/page-wrapper';
import { BodyShort, Heading, Tag } from '@navikt/ds-react';

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
    <pre className="m-0">{window.location.pathname}</pre>
  </Tag>
);
