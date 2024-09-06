import { Heading, RadioGroup } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const RadioButtonsRow = styled.div`
  display: flex;
  gap: var(--a-spacing-4);
  width: 100%;
`;

export const SubSection = styled.div`
  margin-bottom: var(--a-spacing-4);
  margin-left: var(--a-spacing-8);
`;

export const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
`;

export const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: var(--a-spacing-4);
`;
