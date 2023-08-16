import {
  AnyObject,
  Plate,
  PlatePlugin,
  PlateProvider,
  PlateProviderProps,
  RenderLeafFn,
  TEditableProps,
} from '@udecode/plate-common';
import React, { useRef } from 'react';
import { renderLeaf as defaultRenderLeaf } from '@app/plate/leaf/render-leaf';
import { EditorValue, RichTextEditor } from '@app/plate/types';

const editableProps: TEditableProps<EditorValue> = {
  spellCheck: true,
  autoFocus: false,
  className: 'smart-editor',
};

interface PlateEditorContextComponentProps {
  id: string;
  initialValue: EditorValue;
  onChange: (value: EditorValue) => void;
  children: React.ReactNode;
  readonly?: boolean;
  renderLeaf?: RenderLeafFn<EditorValue>;
  decorate?: PlateProviderProps<EditorValue, RichTextEditor>['decorate'];
  plugins: PlatePlugin<AnyObject, EditorValue, RichTextEditor>[];
}

export const PlateEditorContextComponent = ({
  id,
  initialValue,
  onChange,
  children,
  readonly,
  renderLeaf = defaultRenderLeaf,
  plugins,
  decorate,
}: PlateEditorContextComponentProps) => {
  const editorRef = useRef<RichTextEditor>(null);

  return (
    <PlateProvider<EditorValue, RichTextEditor>
      editorRef={editorRef}
      initialValue={initialValue}
      plugins={plugins}
      renderLeaf={renderLeaf}
      readOnly={readonly}
      id={id}
      onChange={onChange}
      decorate={decorate}
    >
      {children}
    </PlateProvider>
  );
};

interface PlateEditorProps {
  id: string;
  readOnly?: boolean;
}

export const PlateEditor = ({ id, readOnly = false }: PlateEditorProps) => (
  <Plate<EditorValue, RichTextEditor> editableProps={editableProps} id={id} readOnly={readOnly} />
);
