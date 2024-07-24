import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { findNode, isCollapsed, isText, setNodes } from '@udecode/plate-common';
import { useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { RichText, useMyPlateEditorState } from '@app/plate/types';

export const BookmarkButton = () => {
  const { addBookmark } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState();
  const disabled = useIsUnchangeable() || isCollapsed(editor.selection);
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const setBookmark = (bookmark: string) => {
    const id = BOOKMARK_PREFIX + Date.now();
    setNodes(editor, { [id]: bookmark }, { match: isText, split: true });

    const entries = editor.nodes<RichText>({ match: (n) => isText(n) && id in n });
    const nodes: RichText[] = [];

    for (const [node] of entries) {
      nodes.push(node);
    }

    addBookmark(id, nodes);
  };

  const activeEntry = findNode<RichText>(editor, {
    match: (n) => isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
  });

  const activeBookmark = getActiveBookmark(activeEntry?.[0]);

  useOnClickOutside(ref, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const active = activeBookmark !== null;
  const Icon = active ? BookmarkFillIcon : BookmarkIcon;
  const label = active ? 'Bytt bokmerke' : 'Sett bokmerke';

  return (
    <Container ref={ref}>
      <ToolbarIconButton
        label={label}
        icon={<Icon style={{ color: activeBookmark ?? 'inherit' }} />}
        onClick={() => setIsOpen(!isOpen)}
        active={active}
        disabled={disabled}
        variant="tertiary-neutral"
      />
      {isOpen ? (
        <Bookmarks>
          {BOOKMARKS.map((color) => (
            <Bookmark key={color.value} color={color} setIsOpen={setIsOpen} setBookmark={setBookmark} />
          ))}
        </Bookmarks>
      ) : null}
    </Container>
  );
};

const getActiveBookmark = (text: RichText | undefined): string | null => {
  if (text === undefined) {
    return null;
  }

  for (const key in text) {
    if (key.startsWith(BOOKMARK_PREFIX)) {
      const value = text[key];

      return typeof value === 'string' ? value : null;
    }
  }

  return null;
};

interface BookmarkProps {
  color: IBookmark;
  setIsOpen: (open: boolean) => void;
  setBookmark: (color: string) => void;
}

const Bookmark = ({ color, setIsOpen, setBookmark }: BookmarkProps) => (
  <Tooltip content={color.name} key={color.value}>
    <StyledButton
      onClick={() => {
        pushEvent('set-bookmark', 'smart-editor', { color: color.name });
        setBookmark(color.value);
        setIsOpen(false);
      }}
      size="small"
      variant="tertiary-neutral"
    >
      <BookmarkFillIcon aria-hidden color={color.value} />
    </StyledButton>
  </Tooltip>
);

const StyledButton = styled(Button)`
  > span {
    line-height: 0;
  }
`;

const Container = styled.div`
  position: relative;
  font-size: 12pt;
`;

const Bookmarks = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: row;
  column-gap: 0;
  background-color: white;
  padding: 4px;
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
`;

interface IBookmark {
  name: string;
  value: string;
}

const BOOKMARKS: [IBookmark, IBookmark, IBookmark] = [
  {
    name: 'Rød',
    value: 'var(--a-red-600)',
  },
  {
    name: 'Grønn',
    value: 'var(--a-green-600)',
  },
  {
    name: 'Blå',
    value: 'var(--a-blue-600)',
  },
];
