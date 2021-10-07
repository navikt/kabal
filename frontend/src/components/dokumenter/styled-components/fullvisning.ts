import { Knapp } from 'nav-frontend-knapper';
import { Checkbox } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { LabelTema } from '../../../styled-components/labels';
import { DocumentCheckbox } from '../alle-dokumenter/document-checkbox';

export const DokumenterFullvisning = styled.section`
  flex-grow: 1;
`;

export const List = styled.ul`
  display: block;
  list-style: none;
  font-size: 16px;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  padding-right: 8px;
`;

export const ListItem = styled.li`
  border-top: 1px solid #c6c2bf;
  padding-bottom: 8px;
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
`;

export const RightAlign = styled.div`
  display: flex;
  justify-content: right;
  float: right; //for safari
  position: relative;
`;

export const DocumentRow = styled.article`
  margin: 0;
  display: grid;
  grid-template-areas:
    'tittel tema dato sjekkboks'
    'vedlegg vedlegg vedlegg vedlegg';
  grid-template-columns: 350px 140px auto 32px;
  grid-column-gap: 1em;
`;

export const DocumentDate = styled.time`
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  grid-area: dato;
`;

export const DocumentTitle = styled.h1`
  font-size: 1em;
  font-weight: normal;
  margin: 0;
  cursor: pointer;
  color: #0067c5;
  grid-area: tittel;
`;

export const StyledDokumentCheckbox = styled(Checkbox)`
  font-size: 0;
  line-height: 0;
  grid-area: sjekkboks;
`;

export const DocumentTema = styled(LabelTema)`
  grid-area: tema;
`;

export const TemaText = styled.div`
  max-width: 8em;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

export const VedleggBeholder = styled.div`
  grid-area: vedlegg;
  margin-left: 2em;
`;

export const VedleggRad = styled.article`
  list-style: none;
  margin: 0;
  padding: 0.65em 0 0 0;
  display: flex;
  justify-content: space-between;
`;

export const VedleggTittel = styled.h1`
  margin: 0;
  color: #0067c5;
  min-width: 15em;
  font-size: 1em;
`;

export const StyledLastFlereKnapp = styled(Knapp)`
  width: calc(100% - 32px);
  margin-bottom: 1em;
  margin-top: 1em;
  margin-left: 16px;
  margin-right: 16px;
`;
