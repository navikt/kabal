import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/journalfoerte-documents/grid';
import { DocumentSearch } from '@app/components/documents/journalfoerte-documents/header/document-search';
import { ExpandedHeaders } from '@app/components/documents/journalfoerte-documents/header/expanded-headers';
import { IncludedFilter } from '@app/components/documents/journalfoerte-documents/header/included-filter';
import { SelectAll } from '@app/components/documents/journalfoerte-documents/header/select-all';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  type ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';
import { IS_WINDOWS } from '@app/keys';
import { ChevronRightDoubleIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { css, styled } from 'styled-components';
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

const BASE_CLASSES =
  'grid gap-x-2 items-center z-1 shrink-0 overflow-visible whitespace-nowrap bg-bg-default border-b border-border-divider pt-1 pb-2 px-2';

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

  return (
    <StyledListHeader
      $isExpanded={isExpanded}
      $columns={columns}
      className={IS_WINDOWS ? `${BASE_CLASSES} mr-[13px]` : BASE_CLASSES}
    >
      <SelectAll />

      <Tooltip content={tooltip} placement="top">
        <Button
          size="small"
          variant="tertiary"
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
    </StyledListHeader>
  );
};

const COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [
  Fields.Select,
  Fields.ToggleVedlegg,
  Fields.Title,
  Fields.ToggleMetadata,
  Fields.Action,
];

const getGridCss = ({ $isExpanded, $columns }: StyledListHeaderProps) => {
  if (!$isExpanded) {
    return toCss(
      getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
      getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
    );
  }

  const fields = [
    Fields.Select,
    Fields.ToggleVedlegg,
    Fields.Title,
    $columns.TEMA ? Fields.Tema : null,
    $columns.DATO_OPPRETTET ? Fields.DatoOpprettet : null,
    $columns.DATO_REG_SENDT ? Fields.DatoRegSendt : null,
    $columns.AVSENDER_MOTTAKER ? Fields.AvsenderMottaker : null,
    $columns.SAKSNUMMER ? Fields.Saksnummer : null,
    $columns.TYPE ? Fields.Type : null,
    Fields.ToggleMetadata,
    Fields.Action,
  ].filter(isNotNull);

  return toCss(getFieldSizes(fields), getFieldNames(fields));
};

const toCss = (columns: string, areas: string) => css`
  grid-template-columns: ${columns};
  grid-template-areas: '${areas}';
`;

interface StyledListHeaderProps {
  $isExpanded: boolean;
  $columns: Record<ArchivedDocumentsColumn, boolean>;
}

const StyledListHeader = styled.div<StyledListHeaderProps>`
  ${getGridCss}
`;
