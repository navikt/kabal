import { styled } from 'styled-components';

export const Sheet = styled.div<{ $minHeight: boolean }>`
  position: relative;
  width: 210mm;
  min-height: ${({ $minHeight }) => ($minHeight ? '297mm' : 'unset')};
  padding-left: 20mm;
  padding-right: 20mm;
  padding-bottom: 20mm;
  padding-top: 15mm;
  font-size: 12pt;
  background-color: white;
  box-shadow: var(--a-shadow-medium);
  margin-top: 16px;
  flex-shrink: 0;
`;
