import { findNode, select } from '@udecode/plate-common';
import { KeyboardEvent } from 'react';
import { RichTextEditor } from '../../types';
import { ELEMENT_PLACEHOLDER } from '../element-types';

export const handleSelectAll = (editor: RichTextEditor, e: KeyboardEvent) => {
  const lowerCaseKey = e.key.toLowerCase();

  if ((e.ctrlKey || e.metaKey) && lowerCaseKey === 'a') {
    const placeholder = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });

    if (placeholder !== undefined) {
      e.preventDefault();
      e.stopPropagation();

      select(editor, placeholder[1]);
    }

    return true;
  }

  return false;
};
