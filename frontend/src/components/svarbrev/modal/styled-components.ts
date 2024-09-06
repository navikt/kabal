import { Modal } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const Row = styled(Flex)`
  column-gap: var(--a-spacing-4);
`;

export const TimeInputContainer = styled(Flex)`
  column-gap: var(--a-spacing-2);
`;

export const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-1);
  font-style: italic;
  font-size: var(--a-spacing-4);
`;

export const StyledTime = styled.time`
  font-weight: bold;
`;

export const CenterLoader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

export const PdfWithLoader = styled.div`
  height: 100%;
  position: relative;
  height: min(90vh, 1500px);
  width: 100%;
`;

export const StyledPDF = styled.object`
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  width: min(90vw, 1100px);
`;
