import { createGlobalStyle, css } from 'styled-components';
import '@navikt/ds-css';

const styles = css`
  html {
    box-sizing: border-box;
    font-family: 'Source Sans Pro', Arial, sans-serif;
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
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
