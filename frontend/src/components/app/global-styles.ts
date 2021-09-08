import { createGlobalStyle, css } from 'styled-components';

const styles = css`
  body {
    margin: 0;
  }

  html,
  body,
  main,
  #app {
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    margin: 0;
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
