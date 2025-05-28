import { Thread } from '@app/components/smart-editor/comments/thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useSmartEditorExpandedThreads } from '@app/hooks/settings/use-setting';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useMyPlateEditorRef } from '@app/plate/types';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { COMMENT_PREFIX } from '../constants';

interface Props {
  thread: ISmartEditorComment;
  isFocused: boolean;
  isOrphan?: boolean;
  style?: React.CSSProperties;
  isAbsolute?: boolean;
  zIndex?: number;
}

const DONT_WAIT_FOR_TRANSITION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ExpandableThread = ({ thread, isFocused, style, isOrphan = false, isAbsolute = false, zIndex }: Props) => {
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const { value: expandedThreads = true } = useSmartEditorExpandedThreads();

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

      const leafEntry = editor.api.node({ at: [], match: { [`${COMMENT_PREFIX}${thread.id}`]: true } });

      if (leafEntry === undefined) {
        return;
      }

      const [leafNode] = leafEntry;
      const domNode = editor.api.toDOMNode(leafNode);

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
  }, [isFocused]);

  return (
    <Thread
      ref={ref}
      thread={thread}
      isAbsolute={isAbsolute}
      isExpanded={expandedThreads || isFocused}
      onClick={open}
      style={{ ...style, transform: isFocused ? 'translateX(-10px)' : 'translateX(0px)' }}
      zIndex={zIndex ?? 0}
    />
  );
};
