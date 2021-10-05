import { createGlobalStyle, css } from 'styled-components';

const styles = css`
  html {
    box-sizing: border-box;
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
    margin: 0;
    width: 100%;
    overflow: hidden;
  }

  #app {
    display: flex;
    flex-flow: column;
  }
`;

export const GlobalStyles = createGlobalStyle`${styles}`;
