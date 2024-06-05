import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { DocumentDate } from '@app/components/documents/journalfoerte-documents/document/document-date';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsFilterSaksId, useDocumentsFilterTema } from '@app/hooks/settings/use-setting';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { AvsenderMottaker } from './avsender-mottaker';
import { JournalposttypeTag } from './journalposttype';

interface Props {
  document: IArkivertDocument;
  showMetadata: boolean;
  toggleShowMetadata: () => void;
}

export const ExpandedColumns = ({ document, showMetadata, toggleShowMetadata }: Props) => {
  const { tema, avsenderMottaker, sak, journalposttype } = document;

  const { setValue: setSaksId } = useDocumentsFilterSaksId();
  const { setValue: setTema } = useDocumentsFilterTema();

  const temaName = useFullTemaNameFromIdOrLoading(tema);
  const { columns } = useArchivedDocumentsColumns();

  return (
    <>
      {columns.TEMA ? (
        <TemaButton $area={Fields.Tema} onClick={() => setTema([tema ?? 'UNKNOWN'])} title={temaName}>
          {temaName}
        </TemaButton>
      ) : null}
      {columns.DATO_OPPRETTET ? <StyledDate date={document.datoOpprettet} $gridArea={Fields.DatoOpprettet} /> : null}
      {columns.DATO_REG_SENDT ? <StyledDate date={document.datoRegSendt} $gridArea={Fields.DatoRegSendt} /> : null}
      {columns.AVSENDER_MOTTAKER ? (
        <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
      ) : null}
      {columns.SAKSNUMMER ? (
        <SaksIdButton size="small" variant="tertiary" onClick={() => setSaksId([sak?.fagsakId ?? 'NONE'])}>
          {sak?.fagsakId ?? 'Ingen'}
        </SaksIdButton>
      ) : null}
      {columns.TYPE ? <JournalposttypeTag type={journalposttype} /> : null}
      <ExpandButton
        variant={showMetadata ? 'primary' : 'tertiary'}
        size="small"
        icon={<InformationSquareIcon aria-hidden />}
        onClick={toggleShowMetadata}
      />
    </>
  );
};

interface StyledDateProps {
  $gridArea: Fields.DatoOpprettet | Fields.DatoRegSendt;
}

const StyledDate = styled(DocumentDate)<StyledDateProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
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

const ExpandButton = styled(Button)`
  grid-area: ${Fields.ToggleMetadata};
`;
