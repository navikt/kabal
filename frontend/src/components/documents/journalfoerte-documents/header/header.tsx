import React, { useMemo } from 'react';
import { css, styled } from 'styled-components';
import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import { DocumentSearch } from '@app/components/documents/journalfoerte-documents/header/document-search';
import { IncludedFilter } from '@app/components/documents/journalfoerte-documents/header/included-filter';
import { SelectAll } from '@app/components/documents/journalfoerte-documents/header/select-all';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsFilterDatoOpprettet, useDocumentsFilterDatoRegSendt } from '@app/hooks/settings/use-setting';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { IArkivertDocumentReference } from '../select-context/types';
import { DateFilter } from './date-filter';
import { useFilters } from './use-filters';

interface Props {
  filters: ReturnType<typeof useFilters>;
  allSelectableDocuments: IArkivertDocumentReference[];
}

export const Header = ({ allSelectableDocuments, filters }: Props) => {
  const [isExpanded] = useIsExpanded();
  const { columns } = useArchivedDocumentsColumns();

  const { setSearch, search } = filters;

  return (
    <StyledListHeader $isExpanded={isExpanded} $columns={columns}>
      <SelectAll allSelectableDocuments={allSelectableDocuments} />
      <DocumentSearch setSearch={setSearch} search={search} />

      {isExpanded ? <ExpandedHeaders {...filters} /> : null}

      <IncludedFilter />
    </StyledListHeader>
  );
};

const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
}: ReturnType<typeof useFilters>) => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetArkiverteDokumenterQuery(oppgaveId);
  const { columns } = useArchivedDocumentsColumns();
  const datoOpprettetSetting = useDocumentsFilterDatoOpprettet();
  const datoRegSendtSetting = useDocumentsFilterDatoRegSendt();

  const avsenderMottakerOptions = useMemo(
    () =>
      (data?.avsenderMottakerList ?? []).map(({ id, navn }) => ({ label: navn ?? 'Ukjent', value: id ?? 'UNKNOWN' })),
    [data],
  );

  const saksIdOptions = useMemo(
    () => (data?.sakList ?? []).map(({ fagsakId }) => ({ label: fagsakId, value: fagsakId })),
    [data],
  );

  const allTemaer = useAllTemaer();

  return (
    <>
      {columns.TEMA ? (
        <StyledFilterDropdown
          options={kodeverkValuesToDropdownOptions(allTemaer)}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          direction="left"
          $area={Fields.Tema}
          data-testid="filter-tema"
        >
          Tema
        </StyledFilterDropdown>
      ) : null}

      {columns.DATO_OPPRETTET ? <DateFilter {...datoOpprettetSetting} label="Dato opprettet" /> : null}
      {columns.DATO_REG_SENDT ? <DateFilter {...datoRegSendtSetting} label="Dato reg./sendt" /> : null}

      {columns.AVSENDER_MOTTAKER ? (
        <StyledFilterDropdown
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          direction="left"
          maxWidth="600px"
          $area={Fields.AvsenderMottaker}
          data-testid="filter-avsender-mottaker"
        >
          Avsender/mottaker
        </StyledFilterDropdown>
      ) : null}

      {columns.SAKSNUMMER ? (
        <StyledFilterDropdown
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          direction="left"
          $area={Fields.Saksnummer}
          data-testid="filter-saksnummer"
        >
          Saksnummer
        </StyledFilterDropdown>
      ) : null}

      {columns.TYPE ? (
        <StyledFilterDropdown
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
          selected={selectedTypes}
          direction="left"
          $area={Fields.Type}
          data-testid="filter-type"
        >
          Type
        </StyledFilterDropdown>
      ) : null}
    </>
  );
};

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const StyledFilterDropdown = styled(FilterDropdown)<{ $area: Fields }>`
  grid-area: ${({ $area }) => $area};
`;

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  Object.values(Journalposttype).some((value) => value === type);

const COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

const getGridCss = ({ $isExpanded, $columns }: StyledListHeaderProps) => {
  if (!$isExpanded) {
    return toCss(
      getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
      getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS),
    );
  }

  const fields = [
    Fields.SelectRow,
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
  ${documentsGridCSS}
  ${getGridCss}
`;
