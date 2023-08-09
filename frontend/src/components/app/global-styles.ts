import { createGlobalStyle, css } from 'styled-components';
import '@navikt/ds-css';

const styles = css`
  :root {
    --a-font-family: 'Source Sans 3', Arial, sans-serif;
  }

  html {
    box-sizing: border-box;
    font-family: 'Source Sans 3', Arial, sans-serif;
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

  .smart-editor {
    outline: none;
    min-height: 100%;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
