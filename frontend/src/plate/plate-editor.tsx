import { Plate, PlateContent, PlatePlugin, PlateProps, RenderLeafFn } from '@udecode/plate-common';
import React, { useRef } from 'react';
import { renderLeaf as defaultRenderLeaf } from '@app/plate/leaf/render-leaf';
import { EditorValue, RichTextEditor } from '@app/plate/types';

interface PlateEditorContextComponentProps {
  id: string;
  initialValue: EditorValue;
  onChange?: (value: EditorValue) => void;
  children: React.ReactNode;
  readOnly?: boolean;
  decorate?: PlateProps<EditorValue, RichTextEditor>['decorate'];
  plugins: PlatePlugin[];
}

export const PlateEditorContextComponent = ({
  id,
  initialValue,
  onChange,
  children,
  readOnly,
  plugins,
  decorate,
}: PlateEditorContextComponentProps) => {
  const editorRef = useRef<RichTextEditor>(null);

  return (
    <Plate<EditorValue, RichTextEditor>
      editorRef={editorRef}
      initialValue={initialValue}
      plugins={plugins}
      readOnly={readOnly}
      id={id}
      onChange={onChange}
      decorate={decorate}
    >
      {children}
    </Plate>
  );
};

interface PlateEditorProps {
  id: string;
  readOnly?: boolean;
  renderLeaf?: RenderLeafFn;
}

export const PlateEditor = ({ id, readOnly = false, renderLeaf = defaultRenderLeaf }: PlateEditorProps) => (
  <PlateContent className="smart-editor" spellCheck id={id} readOnly={readOnly} renderLeaf={renderLeaf} />
);
