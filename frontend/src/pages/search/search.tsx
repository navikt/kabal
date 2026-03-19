import { VStack } from '@navikt/ds-react';
import { OppgaveSearch } from '@/components/search/oppgave-search';

export const SearchPage = () => (
  <VStack flexGrow="1" width="100%" overflow="auto">
    <OppgaveSearch />
  </VStack>
);
