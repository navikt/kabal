import { Buildings3Icon, PersonIcon, QuestionmarkIcon, StethoscopeIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { formatFoedselsnummer, formatOrgNum } from '@/functions/format-id';
import { isNotNull } from '@/functions/is-not-type-guards';
import {
  type AvsenderMottaker,
  AvsenderMottakerIdType,
  type IArkiverteDocumentsResponse,
} from '@/types/arkiverte-documents';

interface AvsenderMottakerFilterProps
  extends Pick<ReturnType<typeof useFilters>, 'selectedAvsenderMottakere' | 'setSelectedAvsenderMottakere'> {
  avsenderMottakerList: IArkiverteDocumentsResponse['avsenderMottakerList'];
}

export const AvsenderMottakerFilter = ({
  avsenderMottakerList,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
}: AvsenderMottakerFilterProps) => {
  const options = useMemo(() => {
    const unique = new Map<string, AvsenderMottaker>();

    for (const avsenderMottaker of avsenderMottakerList) {
      const key = getAvsenderMottakerKey(avsenderMottaker);

      if (!unique.has(key)) {
        unique.set(key, avsenderMottaker);
      }
    }

    return unique.values().toArray();
  }, [avsenderMottakerList]);

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedAvsenderMottakere.some((s) => s === getAvsenderMottakerKey(o))),
    [options, selectedAvsenderMottakere],
  );

  const handleChange = useCallback(
    (values: IArkiverteDocumentsResponse['avsenderMottakerList']) => {
      setSelectedAvsenderMottakere(values.map(getAvsenderMottakerKey));
    },
    [setSelectedAvsenderMottakere],
  );

  return (
    <SearchableMultiSelect
      label="Avsender/mottaker"
      options={options}
      value={selectedOptions}
      valueKey={getAvsenderMottakerKey}
      formatOption={formatAvsenderMottaker}
      emptyLabel="Avsender/mottaker"
      filterText={getFilterText}
      onChange={handleChange}
      style={{ gridArea: Fields.AvsenderMottaker }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};

export const getAvsenderMottakerKey = ({ navn, id }: AvsenderMottaker): string => id ?? navn ?? '__UNKNOWN__';

const formatAvsenderMottaker = ({ navn, id, type }: AvsenderMottaker) => (
  <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
    <div className="flex flex-row gap-1">
      {AVSENDER_ICON[type ?? AvsenderMottakerIdType.NULL]}
      <span>{navn}</span>
    </div>

    {id === null ? null : (
      <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
        {formatAvsenderId(id, type)}
      </Tag>
    )}
  </div>
);

const getFilterText = ({ navn, id }: AvsenderMottaker) => [navn, id].filter(isNotNull).join(' ');

const formatAvsenderId = (id: string, type: AvsenderMottakerIdType | null) => {
  switch (type) {
    case AvsenderMottakerIdType.FNR:
      return formatFoedselsnummer(id);
    case AvsenderMottakerIdType.ORGNR:
      return formatOrgNum(id);
    default:
      return id;
  }
};

const AVSENDER_ICON: Record<AvsenderMottakerIdType, React.ReactNode> = {
  [AvsenderMottakerIdType.FNR]: <PersonIcon aria-hidden />,
  [AvsenderMottakerIdType.ORGNR]: <Buildings3Icon aria-hidden />,
  [AvsenderMottakerIdType.HPRNR]: <StethoscopeIcon aria-hidden />,
  [AvsenderMottakerIdType.UTL_ORG]: <Buildings3Icon aria-hidden />,
  [AvsenderMottakerIdType.NULL]: <QuestionmarkIcon aria-hidden />,
  [AvsenderMottakerIdType.UKJENT]: <QuestionmarkIcon aria-hidden />,
};
