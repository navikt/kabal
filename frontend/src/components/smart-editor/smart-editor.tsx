import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { RichTextEditorElement } from '../rich-text/rich-text-editor/rich-text-editor';
import '../rich-text/types/slate-global-types';
import { SmartEditorContext } from './context/smart-editor-context';
import { useCanEditDocument } from './hooks/use-can-edit-document';

export const SmartEditor = (): JSX.Element | null => {
  const { focusedThreadId } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument();

  return (
    <ElementsSection>
      <RichTextEditorElement
        showCommentsButton
        showAnnotationsButton
        showGodeFormuleringerButton
        focusedThreadId={focusedThreadId}
        canEdit={canEdit}
      />
    </ElementsSection>
  );
};

const ElementsSection = styled.article`
  flex-grow: 1;
  width: 210mm;
  height: 100%;
  overflow-y: auto;
  scroll-padding-top: 32px;
  scroll-padding-bottom: 32px;

  > :first-child {
    margin-top: 0;
  }
`;
