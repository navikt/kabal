import styled from 'styled-components';

const Etikett = styled.div`
  display: inline-block;
  padding: 4px 9px;
  border-radius: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 13em;
  border-radius: 4px;
`;

export const EtikettMain = styled(Etikett)`
  background-color: #e0dae7;
  border: 1px solid #634689;
`;

export const EtikettHjemmel = styled(Etikett)`
  background-color: #f1d8d4;
  border: 1px solid #ba3a26;
`;

export const EtikettType = styled(Etikett)`
  background-color: white;
  border: 1px solid #ba3a26;
`;

interface EtikettTemaProps {
  tema?: string;
}

export const EtikettTema = styled(Etikett)<EtikettTemaProps>`
  background-color: #cce1f3;
  border: 1px solid #0067c5;
  background-color: ${({ tema }) => getBackgroundColorFromTema(tema)};
  border: 1px solid ${({ tema }) => getBorderColorFromTema(tema)};
`;

export const EtikettMedunderskriver = styled(Etikett)`
  background-color: #ffeccc;
  border: 1px solid #d47b00;
`;

const enum TemaBackgroundColorEnum {
  DEFAULT = '#cce1f3',
  SYKEPENGER = '#f1d8d4',
}

const enum TemaBorderColorEnum {
  DEFAULT = '#0067c5',
  SYKEPENGER = 'white',
}

const getBackgroundColorFromTema = (temakode?: string): string => {
  switch (temakode) {
    case 'sykepenger':
      return TemaBackgroundColorEnum.SYKEPENGER;
    default:
      return TemaBackgroundColorEnum.DEFAULT;
  }
};

const getBorderColorFromTema = (temakode?: string): string => {
  switch (temakode) {
    case 'sykepenger':
      return TemaBorderColorEnum.SYKEPENGER;
    default:
      return TemaBorderColorEnum.DEFAULT;
  }
};
