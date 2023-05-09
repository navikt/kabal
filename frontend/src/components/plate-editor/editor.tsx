import {
  CommentsProvider,
  ELEMENT_PARAGRAPH,
  Plate,
  PlateFloatingComments,
  PlateProvider,
  TEditableProps,
  Toolbar,
} from '@udecode/plate';
import React from 'react';
import styled from 'styled-components';
import { INITIAL_VALUE } from '@app/components/plate-editor/initial-value';
import { plugins } from '@app/components/plate-editor/plugins/plugins';
import { DefaultToolbarButtons } from '@app/components/plate-editor/toolbar/default-toolbar-buttons';
import { EditorValue, RichTextEditor } from '@app/components/plate-editor/types';
import { useUser } from '@app/simple-api-state/use-user';
import { renderLeaf } from './leaf/render-leaf';

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: false,
  placeholder: 'Skriv her…',
};

export const PlateEditor = () => {
  const { data: user } = useUser();

  return (
    <Container>
      <PlateProvider<EditorValue, RichTextEditor>
        initialValue={INITIAL_VALUE}
        plugins={plugins}
        onChange={(value) => {
          console.log(value[15]);

          // console.log(value);
        }}
        renderLeaf={renderLeaf}
        id="main"
      >
        <StyledToolbar>
          <DefaultToolbarButtons />
        </StyledToolbar>

        <CommentsProvider
          myUserId={user?.navIdent}
          users={{
            Z994488: {
              id: 'Z994488',
              name: 'Christian',
            },
          }}
          comments={{
            '1': {
              id: '1',
              createdAt: Date.now(),
              userId: 'Z994488',
              isResolved: false,
              value: [
                {
                  type: ELEMENT_PARAGRAPH,
                  children: [{ text: 'Hei' }],
                },
              ],
            },
          }}
        >
          <Plate<EditorValue, RichTextEditor> editableProps={editableProps} id="main" />

          <PlateFloatingComments />
        </CommentsProvider>
      </PlateProvider>
    </Container>
  );
};

const Container = styled.div`
  padding-left: 48px;
  padding-right: 48px;
`;

const StyledToolbar = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: sticky;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
  padding: 2px;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2);
`;
