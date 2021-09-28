import { createGlobalStyle, css } from 'styled-components';

const styles = css`
  body {
    margin: 0;
  }

  main {
    overflow: auto;
    padding-bottom: 40px;
  }

  html,
  body,
  main,
  #app {
    min-height: 100vh;
    margin: 0;
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
