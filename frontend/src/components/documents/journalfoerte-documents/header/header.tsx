import React from 'react';
import { css, styled } from 'styled-components';
import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import { DocumentSearch } from '@app/components/documents/journalfoerte-documents/header/document-search';
import { ExpandedHeaders } from '@app/components/documents/journalfoerte-documents/header/expanded-headers';
import { IncludedFilter } from '@app/components/documents/journalfoerte-documents/header/included-filter';
import { SelectAll } from '@app/components/documents/journalfoerte-documents/header/select-all';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useFilters } from './use-filters';

interface Props {
  filters: ReturnType<typeof useFilters>;
  allSelectableDocuments: IJournalfoertDokumentId[];
  listHeight: number;
}

export const Header = ({ allSelectableDocuments, filters, listHeight }: Props) => {
  const [isExpanded] = useIsExpanded();
  const { columns } = useArchivedDocumentsColumns();

  const { setSearch, search } = filters;

  return (
    <StyledListHeader $isExpanded={isExpanded} $columns={columns}>
      <SelectAll allSelectableDocuments={allSelectableDocuments} />
      <DocumentSearch setSearch={setSearch} search={search} />

      {isExpanded ? <ExpandedHeaders {...filters} listHeight={listHeight} /> : null}

      <IncludedFilter />
    </StyledListHeader>
  );
};

const COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [Fields.SelectRow, Fields.Expand, Fields.Title, Fields.Action];

const getGridCss = ({ $isExpanded, $columns }: StyledListHeaderProps) => {
  if (!$isExpanded) {
    return toCss(
      getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
      getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
    );
  }

  const fields = [
    Fields.SelectRow,
    Fields.Expand,
    Fields.Title,
    $columns.TEMA ? Fields.Tema : null,
    $columns.DATO_OPPRETTET ? Fields.DatoOpprettet : null,
    $columns.DATO_REG_SENDT ? Fields.DatoRegSendt : null,
    $columns.AVSENDER_MOTTAKER ? Fields.AvsenderMottaker : null,
    $columns.SAKSNUMMER ? Fields.Saksnummer : null,
    $columns.TYPE ? Fields.Type : null,
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
  ${listHeaderCSS}
  padding-top: 4px;
  ${documentsGridCSS}
  ${getGridCss}
`;
