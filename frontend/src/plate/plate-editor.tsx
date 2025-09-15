import { merge } from '@app/functions/classes';
import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { FormattedText } from '@app/plate/types';
import {
  PlateContent,
  type PlateContentProps,
  type PlateEditor,
  useEditorReadOnly,
  useEditorRef,
} from '@platejs/core/react';
import { NodeApi } from 'platejs';
import type { HTMLAttributes } from 'react';

interface Props extends PlateContentProps {
  lang: SpellCheckLanguage;
}

export const KabalPlateEditor = ({ className, spellCheck = true, ...props }: Props) => {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  return (
    <PlateContent
      {...props}
      readOnly={readOnly || props.readOnly}
      className={merge('min-h-full outline-none', className)}
      spellCheck={spellCheck}
      renderLeaf={({ attributes, children, text }) => (
        <span {...attributes} contentEditable={contentEditable(editor, readOnly, text)} suppressContentEditableWarning>
          {children}
        </span>
      )}
    />
  );
};

const contentEditable = (
  editor: PlateEditor,
  isReadOnly: boolean,
  text: FormattedText,
): HTMLAttributes<HTMLSpanElement>['contentEditable'] => {
  if (isReadOnly) {
    return undefined;
  }

  const path = editor.api.findPath(text);

  if (path === undefined) {
    return false;
  }

  const ancestorEntries = NodeApi.ancestors(editor, path, { reverse: true });

  if (ancestorEntries === undefined) {
    return false;
  }

  for (const [node] of ancestorEntries) {
    if (node.type === ELEMENT_PLACEHOLDER) {
      return true;
    }

    if (node.type === ELEMENT_MALTEKST) {
      return false;
    }
  }

  return true;
};
