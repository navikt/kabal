import { HStack, Label, Search, VStack } from '@navikt/ds-react';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { NONE_ENTRY, NONE_LABEL } from '@/components/send-to-tr/constants';
import type { IYtelse } from '@/types/kodeverk';

export interface SearchFormProps {
  fnr: string;
  setFnr: (fnr: string) => void;
  selectedYtelse: IYtelse | null;
  setSelectedYtelse: (ytelse: IYtelse | null) => void;
  options: Entry<IYtelse | null>[];
  error: boolean;
}

export const SearchForm = ({ fnr, setFnr, selectedYtelse, setSelectedYtelse, options, error }: SearchFormProps) => {
  return (
    <HStack gap="space-16">
      <VStack gap="space-4">
        <Label size="small">Fødselsnummer</Label>
        <Search
          label="Fødselsnummer"
          hideLabel
          size="small"
          variant="simple"
          value={fnr}
          onChange={setFnr}
          error={error ? 'Ugyldig fødselsnummer' : undefined}
        />
      </VStack>
      <VStack gap="space-4" width="18rem">
        <Label size="small">Ytelse</Label>
        <SearchableSelect
          label="Velg ytelse"
          options={options}
          value={selectedYtelse === null ? NONE_ENTRY : toEntry(selectedYtelse)}
          nullLabel={NONE_LABEL}
          onChange={setSelectedYtelse}
        />
      </VStack>
    </HStack>
  );
};

export const toEntry = (ytelse: IYtelse): Entry<IYtelse> => ({
  value: ytelse,
  key: ytelse.id,
  plainText: ytelse.navn,
  label: ytelse.navn,
});
