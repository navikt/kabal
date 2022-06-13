import { createGlobalStyle, css } from 'styled-components';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';

const styles = css`
  html {
    box-sizing: border-box;
    font-family: 'Source Sans Pro', Arial, sans-serif;
    font-size: 16px;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-size: 16px;
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
