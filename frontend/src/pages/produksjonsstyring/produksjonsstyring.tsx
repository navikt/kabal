import { Produksjonsstyring } from '@app/components/produksjonsstyring/produksjonsstyring';
import { Heading } from '@navikt/ds-react';
import { PageWrapper } from '../page-wrapper';

export const ProduksjonsstyringPage = () => (
  <PageWrapper>
    <Heading level="1" size="medium">
      Produksjonsstyring
    </Heading>

    <Produksjonsstyring />
  </PageWrapper>
);
