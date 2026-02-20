import { merge } from '@app/functions/classes';
import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { isEditableTextNode } from '@app/plate/functions/is-editable-text';
import { useMyPlateEditorRef } from '@app/plate/types';
import type { TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { PlateContainer, PlateContent, type PlateContentProps } from 'platejs/react';

interface Props extends Omit<PlateContentProps, 'contentEditable'> {
  lang: SpellCheckLanguage;
  contentEditable?: boolean | undefined | 'dynamic';
}

export const KabalPlateEditor = ({ className, contentEditable, spellCheck = true, ...props }: Props) => {
  const editor = useMyPlateEditorRef();

  return (
    <PlateContainer>
      <PlateContent
        {...props}
        className={merge('min-h-full outline-none', className)}
        spellCheck={spellCheck}
        aria-label="Brevutforming"
        renderLeaf={({ attributes, children, text }) => (
          <span
            {...attributes}
            contentEditable={contentEditable === 'dynamic' ? getContentEditable(editor, text) : contentEditable}
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
