import { Checkbox, HelpText } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const FormSection = styled.section`
  margin-bottom: var(--a-spacing-8);
`;

export const RadioButtonsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

export const StyledCommentField = styled.div`
  margin-left: var(--a-spacing-8);
  width: calc(100% - var(--a-spacing-8));
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-2);
  width: 100%;
  position: relative;
`;

export const StyledCheckbox = styled(Checkbox)`
  white-space: normal;
`;

export const StyledHelpText = styled(HelpText)`
  + .navds-popover {
    white-space: normal;
    max-width: 100%;
  }
`;

export const StyledHeaderHelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
`;
