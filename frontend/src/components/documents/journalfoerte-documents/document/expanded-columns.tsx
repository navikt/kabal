import React from 'react';
import { styled } from 'styled-components';
import {
  ClickableField,
  StyledClickableField,
} from '@app/components/documents/journalfoerte-documents/document/clickable-field';
import { DocumentDate } from '@app/components/documents/journalfoerte-documents/document/document-date';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsFilterSaksId, useDocumentsFilterTema } from '@app/hooks/settings/use-setting';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { AvsenderMottaker } from './avsender-mottaker';
import { JournalposttypeTag } from './journalposttype';

interface Props {
  document: IArkivertDocument;
}

export const ExpandedColumns = ({ document }: Props) => {
  const { tema, avsenderMottaker, sak, journalposttype } = document;

  const { setValue: setSaksId } = useDocumentsFilterSaksId();
  const { setValue: setTema } = useDocumentsFilterTema();

  const temaName = useFullTemaNameFromIdOrLoading(tema);

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
      <StyledDate document={document} />
      <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
      <ClickableField $area={Fields.SaksId} onClick={() => setSaksId([sak?.fagsakId ?? 'NONE'])}>
        {sak?.fagsakId ?? 'Ingen'}
      </ClickableField>
      <JournalposttypeTag type={journalposttype} />
    </>
  );
};

const DocumentTema = styled(LabelTema)`
  grid-area: ${Fields.Tema};
`;

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.Date};
  overflow: hidden;
  text-overflow: ellipsis;
`;
