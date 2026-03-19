import { isPartSelectable } from '@/components/part-lookup/is-part-selectable';
import { PartNameAndIdentifikator } from '@/components/part-name-and-identifikator/part-name-and-identifikator';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { type IdentifikatorPart, IdType } from '@/types/oppgave-common';

interface SearchResultProps {
  result: IdentifikatorPart | undefined;
  isSearching: boolean;
  isError: boolean;
  invalidReceiverMessage: string | null;
  allowUnreachable: boolean;
  onSelect: (part: IdentifikatorPart) => void;
}

export const SearchResult = ({
  result,
  isSearching,
  isError,
  invalidReceiverMessage,
  allowUnreachable,
  onSelect,
}: SearchResultProps) => {
  if (isSearching || isError || invalidReceiverMessage !== null || result === undefined) {
    return null;
  }

  const selectable = isPartSelectable(result, allowUnreachable);

  return (
    <button
      type="button"
      disabled={!selectable}
      className={`flex flex-col gap-1 rounded-sm border-none px-3 py-2 text-left ${selectable ? 'cursor-pointer bg-ax-bg-accent-moderate ring-2 ring-ax-border-accent ring-inset hover:bg-ax-bg-accent-strong hover:text-ax-text-on-colored focus-visible:bg-ax-bg-accent-strong focus-visible:text-ax-text-on-colored focus-visible:outline-none' : 'cursor-not-allowed bg-ax-bg-neutral-soft opacity-60'}`}
      onClick={() => {
        if (selectable) {
          onSelect(result);
        }
      }}
    >
      <span className="flex items-center gap-2">
        <PartNameAndIdentifikator identifikator={result.identifikator} name={result.name} />
        <PartTypeTag type={result.type} />
      </span>
      <PartStatusList statusList={result.statusList} size="xsmall" />
      {!selectable ? <span className="text-ax-text-danger text-small">Kan ikke velges som mottaker</span> : null}
    </button>
  );
};

interface PartTypeTagProps {
  type: IdType;
}

const PartTypeTag = ({ type }: PartTypeTagProps) => {
  const typeLabel = type === IdType.FNR ? 'Person' : 'Organisasjon';

  return (
    <span className="inline-block rounded-sm bg-ax-bg-neutral-moderate px-1.5 py-0.5 text-small">{typeLabel}</span>
  );
};
