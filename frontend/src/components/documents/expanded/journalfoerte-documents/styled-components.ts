import { Checkbox } from '@navikt/ds-react';
import styled from 'styled-components';
import { LabelTema } from '../../../../styled-components/labels';

export const StyledDocumentCheckbox = styled(Checkbox)`
  grid-area: action;
  justify-self: center;
`;

export const DocumentTema = styled(LabelTema)`
  grid-area: meta;
`;
