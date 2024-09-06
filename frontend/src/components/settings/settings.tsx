import { styled } from 'styled-components';
import { Abbreviations } from './abbreviations/abbreviations';
import { Filters } from './filters';
import { Signature } from './signature';

export const Settings = () => (
  <StyledSettings>
    <Filters />
    <Signature />
    <Abbreviations />
  </StyledSettings>
);

const StyledSettings = styled.article`
  display: grid;
  grid-template-columns: 1548px min-content;
  grid-template-areas:
    'filters abbreviations'
    'signature abbreviations';
  gap: var(--a-spacing-4);
`;
