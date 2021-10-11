import styled from 'styled-components';

interface LabelProps {
  fixedWidth?: boolean;
}

const Label = styled.div<LabelProps>`
  display: inline-block;
  padding: 4px 9px;
  border-radius: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 13em;
  width: ${({ fixedWidth }) => (fixedWidth === true ? '13em' : 'auto')};
`;

export const LabelMain = styled(Label)`
  background-color: #e0dae7;
  border: 1px solid #634689;
`;

export const LabelHjemmel = styled(Label)`
  background-color: #f1d8d4;
  border: 1px solid #ba3a26;
`;


export const LabelLovhjemmel = styled(Label)`
  background-color: #CCE1FF;
  border: 1px solid #0067C5;
`;

export const LabelType = styled(Label)`
  background-color: white;
  border: 1px solid #ba3a26;
`;

interface LabelTemaProps {
  tema?: string | null;
}

export const LabelTema = styled(Label)<LabelTemaProps>`
  background-color: #cce1f3;
  border: 1px solid #0067c5;
  background-color: ${({ tema }) => getBackgroundColorFromTema(tema)};
  border: 1px solid ${({ tema }) => getBorderColorFromTema(tema)};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LabelMedunderskriver = styled(Label)`
  background-color: #ffeccc;
  border: 1px solid #d47b00;
`;

export const LabelReturnertTilSaksbehandler = styled(Label)`
  background-color: #D8F9FF;
  border: 1px solid #4CADCD;  
`;

const enum TemaBackgroundColorEnum {
  DEFAULT = '#cce1f3',
  SYKEPENGER = '#f1d8d4',
}

const enum TemaBorderColorEnum {
  DEFAULT = '#0067c5',
  SYKEPENGER = 'white',
}

const getBackgroundColorFromTema = (temakode?: string | null): string => {
  switch (temakode) {
    case 'sykepenger':
      return TemaBackgroundColorEnum.SYKEPENGER;
    default:
      return TemaBackgroundColorEnum.DEFAULT;
  }
};

const getBorderColorFromTema = (temakode?: string | null): string => {
  switch (temakode) {
    case 'sykepenger':
      return TemaBorderColorEnum.SYKEPENGER;
    default:
      return TemaBorderColorEnum.DEFAULT;
  }
};
