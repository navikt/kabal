import { Checkbox, HelpText } from '@navikt/ds-react';
import styled from 'styled-components';

export const KvalitetsVurderingContainer = styled.div`
  padding: 16px;
  width: 400px;
`;

export const FormSection = styled.section`
  margin-bottom: 32px;
`;

export const RadioButtonsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

export const StyledCommentField = styled.div`
  margin-left: 32px;
  width: calc(100% - 32px);
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
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
  gap: 8px;
`;
