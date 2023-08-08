import { Pagination } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { commonStyles } from '@app/components/documents/styled-components/container';
import { RowsPerPage } from '@app/components/rows-per-page';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { TableRowsPerPage, useNumberSetting } from '@app/hooks/settings/use-setting';
import {
  useGetJournalpostIdListQuery,
  useLazyGetDocumentQuery,
  useLazyGetJournalpostQuery,
} from '@app/redux-api/oppgaver/queries/documents';
import { useFilters } from './header/use-filters';
import { JournalfoertHeading } from './heading/heading';

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const filters = useFilters();
  const { data, isLoading } = useGetJournalpostIdListQuery(
    oppgaveId === skipToken
      ? skipToken
      : { oppgaveId, journalposttyper: filters.selectedTypes, temaIdList: filters.selectedTemaer },
  );
  const [getJournalpost] = useLazyGetJournalpostQuery();
  const [getDocument] = useLazyGetDocumentQuery();

  const { resetFilters, noFiltersActive } = filters;

  const [page, setPage] = useState(1);

  const hasData = data !== undefined;

  const { value: pageSize = 20 } = useNumberSetting(TableRowsPerPage.DOCUMENTS);
  const pageCount = hasData ? Math.ceil(data.journalpostList.length / pageSize) : 1;

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    for (const jp of data.journalpostList) {
      getJournalpost(jp.journalpostId);
      getDocument({ journalpostId: jp.journalpostId, dokumentInfoId: jp.dokumentInfoId });

      for (const vedlegg of jp.vedlegg) {
        getDocument({ journalpostId: jp.journalpostId, dokumentInfoId: vedlegg });
      }
    }
  }, [data, getDocument, getJournalpost]);

  if (!hasData) {
    return null;
  }

  const { avsenderMottakerList, journalpostCount, journalpostList, sakList, vedleggCount } = data;

  const journalpostListPage = journalpostList.slice((page - 1) * pageSize, page * pageSize);

  return (
    <SelectContextElement documentList={journalpostList}>
      <Container data-testid="oppgavebehandling-documents-all">
        <JournalfoertHeading
          filteredLength={journalpostList.length}
          journalpostCount={journalpostCount}
          vedleggCount={vedleggCount}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          slicedFilteredDocumentIds={journalpostListPage}
        />
        <Wrapper>
          <Header
            filters={filters}
            slicedFilteredDocuments={journalpostList}
            avsenderMottakerList={avsenderMottakerList}
            sakList={sakList}
          />

          <DocumentList journalpostReferenceList={journalpostListPage} isLoading={isLoading} />

          <Footer>
            <Pagination page={page} count={pageCount} onPageChange={setPage} size="small" />
            <RowsPerPage
              defaultPageSize={20}
              settingKey={TableRowsPerPage.DOCUMENTS}
              data-testid="documents-rows-per-page"
            />
          </Footer>
        </Wrapper>
      </Container>
    </SelectContextElement>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
`;

const Container = styled.section`
  ${commonStyles}
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;
