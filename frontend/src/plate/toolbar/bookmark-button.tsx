import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, Tooltip } from '@navikt/ds-react';
import { TextApi } from 'platejs';
import { useRef, useState } from 'react';

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
    <div ref={ref} className="relative text-[12pt]">
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
          <BoxNew background="default" padding="1" shadow="dialog" borderRadius="medium">
            {BOOKMARKS.map((option) => (
              <Bookmark key={option.id} option={option} setIsOpen={setIsOpen} setBookmark={setBookmark} />
            ))}
          </BoxNew>
        </HStack>
      ) : null}
    </div>
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
  option: BookmarkOption;
  setIsOpen: (open: boolean) => void;
  setBookmark: (color: string) => void;
}

const Bookmark = ({ option, setIsOpen, setBookmark }: BookmarkProps) => (
  <Tooltip content={option.name} key={option.id}>
    <Button
      onClick={() => {
        pushEvent('set-bookmark', 'smart-editor', { color: option.name });
        setBookmark(option.id);
        setIsOpen(false);
      }}
      size="small"
      variant="tertiary-neutral"
      icon={<BookmarkFillIcon aria-hidden className={option.className} />}
    />
  </Tooltip>
);

interface BookmarkOption {
  id: string;
  name: string;
  className: string;
}

const BOOKMARKS: [BookmarkOption, BookmarkOption, BookmarkOption] = [
  {
    id: '1',
    name: 'Rød',
    className: 'text-ax-text-danger-decoration bg-ax-bg-danger-soft-a rounded-sm hover:bg-ax-bg-danger-moderate',
  },
  {
    id: '2',
    name: 'Grønn',
    className: 'text-ax-text-success-decoration bg-ax-bg-success-soft-a rounded-sm hover:bg-ax-bg-success-moderate',
  },
  {
    id: '3',
    name: 'Lilla',
    className:
      'text-ax-text-meta-purple-decoration bg-ax-bg-meta-purple-soft-a rounded-sm hover:bg-ax-bg-meta-purple-moderate',
  },
];

export const BOOKMARK_ID_TO_COLOR: Record<string, string> = Object.fromEntries(
  BOOKMARKS.map(({ id, className: color }) => [id, color]),
);

export const LEGACY_COLOR_TO_NEW: Record<string, string> = {
  'var(--ax-bg-danger-strong)': BOOKMARKS[0].className,
  'var(--ax-bg-success-strong)': BOOKMARKS[1].className,
  'var(--ax-bg-accent-strong)': BOOKMARKS[2].className,
  'var(--a-red-600)': BOOKMARKS[0].className,
  'var(--a-green-600)': BOOKMARKS[1].className,
  'var(--a-blue-600)': BOOKMARKS[2].className,
};
