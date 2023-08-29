import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { DocumentDate } from '@app/components/documents/journalfoerte-documents/document/document-date';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsFilterSaksId, useDocumentsFilterTema } from '@app/hooks/settings/use-setting';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
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
      <TemaButton $area={Fields.Tema} onClick={() => setTema([tema ?? 'UNKNOWN'])} title={temaName}>
        {temaName}
      </TemaButton>
      <StyledDate document={document} />
      <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
      <SaksIdButton size="small" variant="tertiary" onClick={() => setSaksId([sak?.fagsakId ?? 'NONE'])}>
        {sak?.fagsakId ?? 'Ingen'}
      </SaksIdButton>
      <JournalposttypeTag type={journalposttype} />
    </>
  );
};

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.Date};
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface TemaButtonProps {
  $area: Fields;
}

const TemaButton = styled.button<TemaButtonProps>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  cursor: pointer;
  grid-area: ${({ $area }) => $area};
  padding-left: var(--a-spacing-3);
  padding-right: var(--a-spacing-3);
  padding-top: var(--a-spacing-1);
  padding-bottom: var(--a-spacing-1);
  border-radius: var(--a-border-radius-small);
  border: 1px solid var(--a-border-action);
  background-color: var(--a-surface-action-subtle);

  &:hover {
    background-color: var(--a-surface-action-subtle-hover);
  }
`;

const SaksIdButton = styled(Button)`
  grid-area: ${Fields.Saksnummer};
  white-space: nowrap;
  text-align: left;

  > .navds-label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
