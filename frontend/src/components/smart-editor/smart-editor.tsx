import React from 'react';
import styled from 'styled-components';
import { PlateEditor } from '@app/components/plate-editor/editor';

export const SmartEditor = (): JSX.Element | null => (
  // const { focusedThreadId } = useContext(SmartEditorContext);
  // const canEdit = useCanEditDocument();

  <ElementsSection>
    <PlateEditor />
    {/* <RichTextEditorElement
        showCommentsButton
        showAnnotationsButton
        showGodeFormuleringerButton
        focusedThreadId={focusedThreadId}
        canEdit={canEdit}
      /> */}
  </ElementsSection>
);

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
