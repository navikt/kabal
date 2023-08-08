import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import {
  ClickableField,
  StyledClickableField,
} from '@app/components/documents/journalfoerte-documents/document/clickable-field';
import { DocumentDate } from '@app/components/documents/journalfoerte-documents/document/document-date';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsFilterSaksId, useDocumentsFilterTema } from '@app/hooks/settings/use-setting';
import { useFullTemaNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';
import { IJournalpost } from '@app/types/arkiverte-documents';
import { AvsenderMottaker } from './avsender-mottaker';
import { JournalposttypeTag } from './journalposttype';

interface Props {
  journalpost: IJournalpost | undefined;
}

export const ExpandedColumns = ({ journalpost }: Props) => {
  const { setValue: setSaksId } = useDocumentsFilterSaksId();
  const { setValue: setTema } = useDocumentsFilterTema();

  const temaName = useFullTemaNameFromId(journalpost?.tema ?? null);

  if (journalpost === undefined) {
    return <Skeletons />;
  }

  const { tema, avsenderMottaker, sak, journalposttype } = journalpost;

  return (
    <>
      <DocumentTema
        as={StyledClickableField}
        $area={Fields.Tema}
        size="small"
        variant="tertiary"
        onClick={() => setTema([tema ?? 'UNKNOWN'])}
        title={temaName}
      >
        {temaName}
      </DocumentTema>
      <StyledDate journalpost={journalpost} />
      <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
      <ClickableField $area={Fields.SaksId} onClick={() => setSaksId([sak?.fagsakId ?? 'NONE'])}>
        {sak?.fagsakId ?? 'Ingen'}
      </ClickableField>
      <JournalposttypeTag type={journalposttype} />
    </>
  );
};

const Skeletons = () => (
  <>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
  </>
);

const DocumentTema = styled(LabelTema)`
  grid-area: ${Fields.Tema};
`;

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.Date};
  overflow: hidden;
  text-overflow: ellipsis;
`;
