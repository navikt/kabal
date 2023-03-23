import React, { useContext, useRef } from 'react';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { SmartEditorContext } from '../context/smart-editor-context';
import { EditorContainer } from './styled-components';

interface CommentsClickBoundaryProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const CommentsClickBoundary = ({ children, isActive }: CommentsClickBoundaryProps) => {
  const { setFocusedThreadId } = useContext(SmartEditorContext);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    setFocusedThreadId(null);
  });

  return (
    <EditorContainer isActive={isActive} ref={ref}>
      {children}
    </EditorContainer>
  );
};
