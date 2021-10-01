import { createGlobalStyle, css } from 'styled-components';

const styles = css`
  html,
  body,
  #app {
    min-height: 100vh;
    margin: 0;
    width: 100%;
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
