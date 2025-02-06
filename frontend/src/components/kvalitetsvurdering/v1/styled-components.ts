import { Checkbox, HelpText } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const FormSection = styled.section`
  margin-bottom: var(--a-spacing-8);
`;

export const StyledCommentField = styled.div`
  margin-left: var(--a-spacing-8);
  width: calc(100% - var(--a-spacing-8));
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
