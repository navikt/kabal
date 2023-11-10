import { css, styled } from 'styled-components';
import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import {
  documentCSS,
  getBackgroundColor,
  getHoverBackgroundColor,
} from '@app/components/documents/styled-components/document';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';

const COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

const getGridCss = ({ $isExpanded, $columns }: Props) => {
  if (!$isExpanded) {
    return toCss(
      getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS),
      getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS),
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

interface Props {
  $expanded: boolean;
  $selected: boolean;
  $isExpanded: boolean;
  $columns: Record<ArchivedDocumentsColumn, boolean>;
}

export const StyledJournalfoertDocument = styled.article<Props>`
  ${documentCSS}
  ${documentsGridCSS}
  
  ${getGridCss}
  
  background-color: ${({ $expanded, $selected }) => getBackgroundColor($expanded, $selected)};

  &:hover {
    background-color: ${({ $expanded, $selected }) => getHoverBackgroundColor($expanded, $selected)};
  }
`;
