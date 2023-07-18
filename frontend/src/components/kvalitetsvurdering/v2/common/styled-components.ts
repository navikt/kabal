import { Heading, RadioGroup } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const RadioButtonsRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

export const SubSection = styled.div`
  margin-bottom: 16px;
  margin-left: 32px;
`;

export const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: 16px;
`;
