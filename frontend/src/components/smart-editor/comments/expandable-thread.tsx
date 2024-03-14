import { findNode, toDOMNode } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Thread } from '@app/components/smart-editor/comments/thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useMyPlateEditorRef } from '@app/plate/types';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { COMMENT_PREFIX } from '../constants';

interface Props {
  thread: ISmartEditorComment;
  isFocused: boolean;
  isOrphan?: boolean;
  style?: React.CSSProperties;
  isAbsolute?: boolean;
}

const DONT_WAIT_FOR_TRANSITION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ExpandableThread = ({ thread, isFocused, style, isOrphan = false, isAbsolute = false }: Props) => {
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();

  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (focusedThreadId === thread.id) {
      setFocusedThreadId(null);
    }
  }, [focusedThreadId, setFocusedThreadId, thread.id]);

  useOnClickOutside(ref, close);

  const open: React.MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (focusedThreadId === thread.id) {
        return;
      }

      setFocusedThreadId(thread.id);

      if (isOrphan) {
        return;
      }

      const leafEntry = findNode(editor, { at: [], match: { [`${COMMENT_PREFIX}${thread.id}`]: true } });

      if (leafEntry === undefined) {
        return;
      }

      const [leafNode] = leafEntry;
      const domNode = toDOMNode(editor, leafNode);

      if (domNode === undefined) {
        return;
      }

      if (DONT_WAIT_FOR_TRANSITION) {
        return domNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      event.currentTarget.addEventListener(
        'transitionend',
        () => setTimeout(() => domNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })),
        { once: true },
      );
    },
    [editor, focusedThreadId, isOrphan, setFocusedThreadId, thread.id],
  );

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' }));
    }
  }, [isFocused, ref]);

  return (
    <Thread
      ref={ref}
      thread={thread}
      isAbsolute={isAbsolute}
      isExpanded={isFocused}
      onClick={open}
      style={{ ...style, transform: isFocused ? 'translateX(-10px)' : 'translateX(0px)' }}
    />
  );
};
