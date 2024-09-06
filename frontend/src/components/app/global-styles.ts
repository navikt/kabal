import { createGlobalStyle, css } from 'styled-components';
import '@navikt/ds-css';

const styles = css`
  :root {
    --a-font-family: 'Source Sans 3', Arial, sans-serif;
    --kabal-editor-scale: 1;
  }

  html {
    box-sizing: border-box;
    font-family: 'Source Sans 3', Arial, sans-serif;
    font-size: var(--a-spacing-4);

    --kabal-bg-medium: var(--a-gray-200);

    &[data-theme='dark'] {
      --a-bg-default: var(--a-surface-inverted);
      --a-bg-subtle: var(--a-grayalpha-800);
      --a-surface-default: var(--a-surface-inverted);
      --a-surface-subtle: var(--a-grayalpha-800);
      --a-text-default: var(--a-text-on-inverted);

      --kabal-bg-medium: var(--a-gray-800);

      background-color: var(--a-bg-default);
    }
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
    font-size: var(--a-spacing-4);
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
