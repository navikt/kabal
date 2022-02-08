import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { StyledCheckbox } from '../../../../styled-components/checkbox';
import { LabelTema } from '../../../../styled-components/labels';

export const StyledDocumentCheckbox = styled(StyledCheckbox)`
  grid-area: action;
  justify-self: center;
`;

export const DocumentTema = styled(LabelTema)`
  grid-area: meta;
`;

export const StyledLoadMoreButton = styled(Knapp)`
  width: calc(100% - 32px);
  margin-bottom: 1em;
  margin-top: 1em;
  margin-left: 16px;
  margin-right: 16px;
`;
