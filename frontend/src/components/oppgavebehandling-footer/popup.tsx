import { Panel } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';

interface Props {
  children: React.ReactNode;
  close: () => void;
}

export const FooterPopup = ({ children, close }: Props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, close);

  return <StyledPanel ref={ref}>{children}</StyledPanel>;
};

const StyledPanel = styled(Panel)`
  position: absolute;
  left: 0;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--a-shadow-medium);
`;
