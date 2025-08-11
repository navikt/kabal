import { OppgaveSearch } from '@app/components/search/oppgave-search';
import { VStack } from '@navikt/ds-react';

export const SearchPage = () => (
  <VStack flexGrow="1" width="100%" overflow="auto">
    <OppgaveSearch />
  </VStack>
);
