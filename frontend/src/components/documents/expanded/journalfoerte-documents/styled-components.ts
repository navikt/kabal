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
