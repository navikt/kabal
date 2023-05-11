import { Plate, PlateProvider, TEditableProps, usePlateEditorRef } from '@udecode/plate';
import React, { memo } from 'react';
import { renderLeaf } from '../leaf/render-leaf';
import { EditorValue, RichTextEditor } from '../types';

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: false,
  autoFocus: false,
};

export const MaltekstContent = memo(
  ({ value }: { value: EditorValue }) => {
    const id = Math.random();
    const editor = usePlateEditorRef<EditorValue>();

    return (
      <PlateProvider<EditorValue, RichTextEditor>
        initialValue={value}
        plugins={editor.plugins}
        renderLeaf={renderLeaf}
        id={id}
        readOnly
      >
        <Plate<EditorValue, RichTextEditor> editableProps={editableProps} id={id} value={value} />
      </PlateProvider>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);

MaltekstContent.displayName = 'MaltekstContent';
