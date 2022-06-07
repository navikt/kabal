import styled, { css } from 'styled-components';

const headingStyle = css`
  & {
    margin-bottom: 0;
    margin-top: 1em;
  }
`;

export const HeadingOneStyle = styled.h1`
  font-size: 16pt;
  font-weight: 700;
  ${headingStyle}
`;

export const HeadingTwoStyle = styled.h2`
  font-size: 14pt;
  font-weight: 700;
  ${headingStyle}
`;

export const HeadingThreeStyle = styled.h3`
  font-size: 12pt;
  font-weight: 700;
  ${headingStyle}
`;

export const HeadingFourStyle = styled.h4`
  font-size: 12pt;
`;

export const HeadingFiveStyle = styled.h5`
  font-size: 12pt;
`;

export const HeadingSixStyle = styled.h6`
  font-size: 12pt;
`;
