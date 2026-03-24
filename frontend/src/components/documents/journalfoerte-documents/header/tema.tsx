import { Tag } from '@navikt/ds-react';
import { useMemo } from 'react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useAllTemaer } from '@/hooks/use-all-temaer';
import type { IKodeverkValue } from '@/types/kodeverk';

interface Props extends Pick<ReturnType<typeof useFilters>, 'selectedTemaer' | 'setSelectedTemaer'> {}

export const Tema = ({ selectedTemaer, setSelectedTemaer }: Props) => {
  const allTemaer = useAllTemaer();

  const options = useMemo<Entry<IKodeverkValue<string>>[]>(
    () =>
      allTemaer.map((t) => ({
        value: t,
        key: t.id,
        label: (
          <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
            <div className="flex flex-row gap-1">
              <span>{t.beskrivelse}</span>
            </div>

            <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
              {t.navn}
            </Tag>
          </div>
        ),
        plainText: `${t.beskrivelse} ${t.navn}`,
      })),
    [allTemaer],
  );

  const selected = useMemo(
    () => options.filter((entry) => selectedTemaer.includes(entry.key)),
    [options, selectedTemaer],
  );

  const onChange = (temaer: IKodeverkValue<string>[]) => {
    setSelectedTemaer(temaer.map((t) => t.id));
  };

  return (
    <SearchableMultiSelect
      label="Tema"
      options={options}
      value={selected}
      emptyLabel="Tema"
      onChange={onChange}
      style={{ gridArea: Fields.Tema }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};
