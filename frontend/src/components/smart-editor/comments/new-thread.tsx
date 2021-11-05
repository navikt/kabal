import React, { useContext } from 'react';
import { Range } from 'slate';
import { SmartEditorContext } from '../context/smart-editor-context';
import { NewComment } from './new-comment';

export const NewCommentThread = () => {
  const { selection } = useContext(SmartEditorContext);

  const showNewThread = selection !== null && Range.isExpanded(selection);

  if (!showNewThread) {
    return null;
  }

  return <NewComment />;
};
