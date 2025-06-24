import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Tooltip } from '@navikt/ds-react';
import { TextApi } from 'platejs';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';

export const BookmarkButton = () => {
  const editor = useMyPlateEditorState();
  const disabled = useIsUnchangeable();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const setBookmark = (bookmark: string) => {
    const id = BOOKMARK_PREFIX + Date.now();
    editor.tf.setNodes({ [BookmarkPlugin.key]: true, [id]: bookmark }, { match: TextApi.isText, split: true });

    const entries = editor.nodes<FormattedText>({ match: (n) => TextApi.isText(n) && id in n });
    const nodes: FormattedText[] = [];

    for (const [node] of entries) {
      nodes.push(node);
    }
  };

  const activeEntry = editor.api.node<FormattedText>({
    match: (n) => TextApi.isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
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
        <HStack asChild position="absolute" right="0" style={{ top: '100%' }}>
          <Box background="bg-default" padding="1" shadow="medium" borderRadius="medium">
            {BOOKMARKS.map((color) => (
              <Bookmark key={color.value} color={color} setIsOpen={setIsOpen} setBookmark={setBookmark} />
            ))}
          </Box>
        </HStack>
      ) : null}
    </Container>
  );
};

const getActiveBookmark = (text: FormattedText | undefined): string | null => {
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
