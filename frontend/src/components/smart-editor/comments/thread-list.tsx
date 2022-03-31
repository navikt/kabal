import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import { SmartEditorContext } from '../context/smart-editor-context';
import { Thread } from './thread';
import { useThreads } from './use-threads';

export const ThreadList = () => {
  const { attached, orphans, isLoading } = useThreads();

  if (isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <CommentsClickBoundry>
      <section>
        {attached.map((thread) => (
          <Thread key={thread.id} thread={thread} isFocused={thread.isFocused} />
        ))}
      </section>
      <section>
        <Header show={orphans.length !== 0} />
        {orphans.map((thread) => (
          <Thread key={thread.id} thread={thread} isFocused={thread.isFocused} />
        ))}
      </section>
    </CommentsClickBoundry>
  );
};

interface HeaderProps {
  show: boolean;
}

const Header = ({ show }: HeaderProps) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <StyledHeader>Andre kommentarer</StyledHeader>
      <Description>Kommentarer som ikke lenger har noen direkte tilknytning til dokumentinnholdet.</Description>
    </>
  );
};

const Description = styled.p`
  margin-left: 24px;
  margin-right: 24px;
  white-space: pre-wrap;
`;

const StyledHeader = styled.h1`
  font-size: 20px;
  margin-left: 24px;
  margin-right: 24px;
`;

const CommentsClickBoundry: React.FC = ({ children }) => {
  const { setFocusedThreadId } = useContext(SmartEditorContext);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => {
    setFocusedThreadId(null);
  }, ref);

  return <div ref={ref}>{children}</div>;
};
