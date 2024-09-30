import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { FormattedText } from '@app/plate/types';
import { getNodeAncestors } from '@udecode/plate-common';
import { PlateContent, type PlateContentProps, type PlateEditor, useEditorRef } from '@udecode/plate-core/react';
import { findNodePath } from '@udecode/slate-react';

interface Props extends PlateContentProps {
  lang: SpellCheckLanguage;
}

export const KabalPlateEditor = ({ className, spellCheck = true, readOnly = false, ...props }: Props) => {
  const editor = useEditorRef();

  return (
    <PlateContent
      {...props}
      readOnly={readOnly}
      className={className === undefined ? 'smart-editor' : `smart-editor ${className}`}
      spellCheck={spellCheck}
      renderLeaf={({ attributes, children, text }) => (
        <span {...attributes} contentEditable={contentEditable(editor, readOnly, text)} suppressContentEditableWarning>
          {children}
        </span>
      )}
    />
  );
};

const contentEditable = (editor: PlateEditor, isReadOnly: boolean, text: FormattedText): boolean => {
  if (isReadOnly) {
    return false;
  }

  const path = findNodePath(editor, text);

  if (path === undefined) {
    return false;
  }

  const ancestorEntries = getNodeAncestors(editor, path, { reverse: true });

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
