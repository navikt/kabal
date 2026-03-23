import { Tag } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { isNotUndefined } from '@/functions/is-not-type-guards';
import { useAllTemaer } from '@/hooks/use-all-temaer';
import type { IKodeverkValue } from '@/types/kodeverk';

interface Props extends Pick<ReturnType<typeof useFilters>, 'selectedTemaer' | 'setSelectedTemaer'> {}

export const Tema = ({ selectedTemaer, setSelectedTemaer }: Props) => {
  const allTemaer = useAllTemaer();

  const selected = selectedTemaer.map((id) => allTemaer.find((t) => t.id === id)).filter(isNotUndefined);

  const onChange = (temaer: IKodeverkValue<string>[]) => {
    setSelectedTemaer(temaer.map((t) => t.id));
  };

  return (
    <SearchableMultiSelect
      label="Tema"
      options={allTemaer}
      value={selected}
      valueKey={getTemaKey}
      formatOption={formatTema}
      emptyLabel="Tema"
      filterText={getFilterText}
      onChange={onChange}
      style={{ gridArea: Fields.Tema }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};

const formatTema = ({ navn, beskrivelse }: IKodeverkValue<string>) => (
  <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
    <div className="flex flex-row gap-1">
      <span>{beskrivelse}</span>
    </div>

    <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
      {navn}
    </Tag>
  </div>
);

const getFilterText = ({ beskrivelse, navn }: IKodeverkValue<string>) => `${beskrivelse} ${navn}`;

const getTemaKey = ({ id }: IKodeverkValue<string>) => id;
