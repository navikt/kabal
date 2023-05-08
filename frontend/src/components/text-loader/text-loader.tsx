import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  0% {
    background-position: 100% 0%;
  }
  100% {
    background-position: -100% 0%;
  }
`;

export const TextLoader = styled.span`
  display: inline-block;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background: #ccc;
  background: linear-gradient(90deg, #ccc 0%, #ccc 33%, #ddd 50%, #ccc 66%, #ccc 100%);
  background-size: 200% 100%;
  animation: ${animation} 1.25s linear infinite;
`;
