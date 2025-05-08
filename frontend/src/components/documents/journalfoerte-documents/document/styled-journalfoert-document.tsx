import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import { isNotNull } from '@app/functions/is-not-type-guards';
import type { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { css, styled } from 'styled-components';

const COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];

const getGridCss = ({ $isExpanded, $columns }: Props) => {
  if (!$isExpanded) {
    return toCss(
      getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS),
      getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS),
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

interface Props {
  $selected: boolean;
  $isExpanded: boolean;
  $columns: Record<ArchivedDocumentsColumn, boolean>;
}

export const StyledJournalfoertDocument = styled.article<Props>`
  ${documentsGridCSS}
  ${getGridCss}
`;
