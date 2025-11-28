import { merge } from '@app/functions/classes';
import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { isEditableTextNode } from '@app/plate/functions/is-editable-text';
import {
  PlateContainer,
  PlateContent,
  type PlateContentProps,
  type PlateEditor,
  useEditorReadOnly,
  useEditorRef,
} from '@platejs/core/react';
import type { TText } from 'platejs';

interface Props extends PlateContentProps {
  lang: SpellCheckLanguage;
}

export const KabalPlateEditor = ({ className, spellCheck = true, ...props }: Props) => {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  return (
    <PlateContainer>
      <PlateContent
        {...props}
        readOnly={readOnly || props.readOnly}
        className={merge('min-h-full outline-none', className)}
        spellCheck={spellCheck}
        renderLeaf={({ attributes, children, text }) => (
          <span
            {...attributes}
            contentEditable={readOnly ? false : getContentEditable(editor, text)}
            suppressContentEditableWarning
          >
            {children}
          </span>
        )}
      />
    </PlateContainer>
  );
};

const getContentEditable = (editor: PlateEditor, textNode: TText) => {
  const path = editor.api.findPath(textNode);

  if (path === undefined) {
    return false;
  }

  return isEditableTextNode(editor, path);
};
