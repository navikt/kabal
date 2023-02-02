import styled from 'styled-components';
import { SaksTypeEnum } from '../types/kodeverk';

interface LabelProps {
  fixedWidth?: boolean;
}

const Label = styled.div<LabelProps>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 13em;
  width: ${({ fixedWidth }) => (fixedWidth === true ? '13em' : 'auto')};
  vertical-align: middle;
  color: var(--a-text-default);
  font-weight: normal;
`;

export const LabelMain = styled(Label)`
  background-color: #e0dae7;
  border: 1px solid #634689;
`;

export const LabelType = styled(Label)<{ type: SaksTypeEnum }>`
  background-color: ${({ type }) => (type === SaksTypeEnum.KLAGE ? 'white' : 'black')};
  color: ${({ type }) => (type === SaksTypeEnum.KLAGE ? '#262626' : 'white')};
  border: 1px solid #ba3a26;
`;

export const LabelTema = styled(Label)`
  background-color: #cce1f3;
  border: 1px solid #0067c5;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LabelMedunderskriver = styled(Label)`
  background-color: #ffeccc;
  border: 1px solid #d47b00;
`;

export const LabelReturnertTilSaksbehandler = styled(Label)`
  background-color: #d8f9ff;
  border: 1px solid #4cadcd;
`;
