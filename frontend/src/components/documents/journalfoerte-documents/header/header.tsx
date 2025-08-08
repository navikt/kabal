import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/journalfoerte-documents/grid';
import { DocumentSearch } from '@app/components/documents/journalfoerte-documents/header/document-search';
import { ExpandedHeaders } from '@app/components/documents/journalfoerte-documents/header/expanded-headers';
import { IncludedFilter } from '@app/components/documents/journalfoerte-documents/header/included-filter';
import { SelectAll } from '@app/components/documents/journalfoerte-documents/header/select-all';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { IS_WINDOWS } from '@app/keys';
import { ChevronRightDoubleIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, HGrid, HStack, Tooltip } from '@navikt/ds-react';
import type { useFilters } from './use-filters';

interface Props {
  documentIdList: string[];
  filters: ReturnType<typeof useFilters>;
  listHeight: number;
  showsAnyVedlegg: boolean;
  toggleShowAllVedlegg: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  keyboardBoundaryRef: React.RefObject<HTMLDivElement | null>;
}

const BASE_CLASSES = 'z-1 whitespace-nowrap bg-ax-bg-default border-b border-ax-border-neutral';
const CLASSES = IS_WINDOWS ? `${BASE_CLASSES} mr-[13px]` : BASE_CLASSES;

export const Header = ({
  filters,
  listHeight,
  showsAnyVedlegg,
  toggleShowAllVedlegg,
  searchRef,
  keyboardBoundaryRef,
}: Props) => {
  const [isExpanded] = useIsExpanded();
  const { columns } = useArchivedDocumentsColumns();

  const { setSearch, search } = filters;

  const tooltip = showsAnyVedlegg ? 'Skjul alle vedlegg' : 'Vis alle vedlegg';

  const fields = [
    Fields.Select,
    Fields.ToggleVedlegg,
    Fields.Title,
    columns.TEMA ? Fields.Tema : null,
    columns.DATO_OPPRETTET ? Fields.DatoOpprettet : null,
    columns.DATO_SORTERING ? Fields.DatoSortering : null,
    columns.AVSENDER_MOTTAKER ? Fields.AvsenderMottaker : null,
    columns.SAKSNUMMER ? Fields.Saksnummer : null,
    columns.TYPE ? Fields.Type : null,
    Fields.ToggleMetadata,
    Fields.Action,
  ].filter(isNotNull);

  return (
    <HGrid
      as="div"
      gap="0 2"
      align="center"
      flexShrink="0"
      paddingBlock="1 2"
      paddingInline="2"
      overflow="visible"
      columns={isExpanded ? getFieldSizes(fields) : getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)}
      className={CLASSES}
      style={{
        gridTemplateAreas: `"${
          isExpanded ? getFieldNames(fields) : getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)
        }"`,
      }}
    >
      <SelectAll />

      <Tooltip content={tooltip} placement="top">
        <Button
          size="small"
          variant="tertiary-neutral"
          icon={<ChevronRightDoubleIcon aria-hidden className={showsAnyVedlegg ? 'rotate-90' : 'rotate-0'} />}
          style={{ gridArea: Fields.ToggleVedlegg }}
          onClick={() => toggleShowAllVedlegg()}
        />
      </Tooltip>

      <DocumentSearch setSearch={setSearch} search={search} ref={searchRef} keyboardBoundaryRef={keyboardBoundaryRef} />

      {isExpanded ? <ExpandedHeaders {...filters} listHeight={listHeight} /> : null}

      <HStack style={{ gridArea: Fields.ToggleMetadata }} align="center" justify="center" padding="1-alt">
        <InformationSquareIcon aria-hidden className="h-full w-full" />
      </HStack>

      <IncludedFilter />
    </HGrid>
  );
};

const COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [
  Fields.Select,
  Fields.ToggleVedlegg,
  Fields.Title,
  Fields.ToggleMetadata,
  Fields.Action,
];
