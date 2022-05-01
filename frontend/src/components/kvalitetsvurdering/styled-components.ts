import { Checkbox, RadioGruppe } from 'nav-frontend-skjema';
import styled from 'styled-components';

export const KvalitetsVurderingContainer = styled.div`
  padding: 16px;
  width: 400px;
`;

export const FormSection = styled.section`
  margin-bottom: 32px;
`;

export const SubHeader = styled.h2`
  font-weight: 600;
  font-size: 22px;
  line-height: 26px;
`;

export const RadioButtonsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

export const RadioButtonsColumn = styled(RadioGruppe)`
  > * {
    margin-bottom: 10px;
  }
`;

export const StyledCommentField = styled.div`
  margin-left: 32px;
  width: calc(100% - 32px);
`;

export const ReasonsField = styled.div`
  margin-top: 10px;
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StyledCheckbox = styled(Checkbox)`
  white-space: normal;
`;
