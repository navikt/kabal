import { HStack, Label, Search, VStack } from '@navikt/ds-react';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { NONE_LABEL } from '@/components/send-til-tr-temp/constants';
import type { IKodeverkSimpleValue, IYtelse, IYtelseInnsendingshjemmel } from '@/types/kodeverk';

export interface SearchFormProps {
  fnr: string;
  setFnr: (fnr: string) => void;
  selectedEntry: Entry<IKodeverkSimpleValue | null> | null;
  setSelectedYtelse: (ytelseId: string) => void;
  options: Entry<IKodeverkSimpleValue | null>[];
  setHjemler: (hjemler: IYtelseInnsendingshjemmel[]) => void;
  ytelser: IYtelse[] | undefined;
}

export const SearchForm = ({
  fnr,
  setFnr,
  selectedEntry,
  setSelectedYtelse,
  options,
  setHjemler,
  ytelser,
}: SearchFormProps) => {
  return (
    <HStack gap="space-16" marginBlock="space-24">
      <VStack gap="space-4">
        <Label size="small">Fødselsnummer</Label>
        <Search label="Fødselsnummer" hideLabel size="small" variant="primary" onChange={setFnr} value={fnr} />
      </VStack>
      <VStack gap="space-4" width="18rem">
        <Label size="small">Ytelse</Label>
        <SearchableSelect
          label="Velg ytelse"
          options={options}
          value={selectedEntry}
          onChange={(value) => {
            setSelectedYtelse(value?.id ?? '');
            const hjemmelList = ytelser?.find((s) => s.id === value?.id);
            setHjemler(hjemmelList?.innsendingshjemler ?? []);
          }}
          nullLabel={NONE_LABEL}
        />
      </VStack>
    </HStack>
  );
};
