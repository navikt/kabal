import { BookmarkFillIcon, BookmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Tooltip } from '@navikt/ds-react';
import { TextApi } from 'platejs';
import { useRef, useState } from 'react';
import type { Bookmark } from '@/components/smart-editor/bookmarks/use-bookmarks';
import { BOOKMARK_PREFIX } from '@/components/smart-editor/constants';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { pushEvent } from '@/observability';
import { useIsUnchangeable } from '@/plate/hooks/use-is-unchangeable';
import {
  BOOKMARK_VARIANT_TO_CLASSNAME,
  BOOKMARK_VARIANTS,
  type BookmarkVariant,
  type BookmarkVariantEnum,
  isBookmarkVariant,
} from '@/plate/toolbar/bookmark-types';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { type FormattedText, useMyPlateEditorState } from '@/plate/types';

export const BookmarkButton = () => {
  const editor = useMyPlateEditorState();
  const disabled = useIsUnchangeable();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const setBookmark = (variant: BookmarkVariantEnum) => {
    pushEvent('set-bookmark', 'smart-editor', { color: variant });
    const id = BOOKMARK_PREFIX + Date.now();
    editor.tf.setNodes({ bookmark: true, [id]: variant }, { match: TextApi.isText, split: true });

    const entries = editor.nodes<FormattedText>({ match: (n) => TextApi.isText(n) && id in n });
    const nodes: FormattedText[] = [];

    for (const [node] of entries) {
      nodes.push(node);
    }
  };

  const removeBookmark = (bookmark: Omit<Bookmark, 'nodes'>) => {
    pushEvent('remove-bookmark', 'smart-editor', { color: bookmark.variant });
    editor.tf.unsetNodes<FormattedText>(['bookmark', bookmark.key], {
      match: (n) => TextApi.isText(n) && bookmark.key in n,
      mode: 'lowest',
      at: [],
      split: true,
    });
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
  const label = active ? 'Fjern hele bokmerket' : 'Sett bokmerke';

  return (
    <HStack ref={ref} position="relative" align="center">
      <ToolbarIconButton
        label={label}
        icon={<Icon active={active} />}
        onClick={() => (active ? removeBookmark(activeBookmark) : setIsOpen(!isOpen))}
        active={active}
        disabled={disabled}
        className={active ? `group/variant ${BOOKMARK_VARIANT_TO_CLASSNAME[activeBookmark.variant]}` : undefined}
        variant="tertiary-neutral"
      />
      {isOpen ? (
        <HStack asChild position="absolute" left="space-0" style={{ top: '100%' }}>
          <Box background="default" padding="space-0" shadow="dialog" borderRadius="4">
            {BOOKMARK_VARIANTS.map((option) => (
              <BookmarkVariantButton
                key={option.variant}
                option={option}
                onClick={() => {
                  setIsOpen(false);
                  setBookmark(option.variant);
                }}
              />
            ))}
          </Box>
        </HStack>
      ) : null}
    </HStack>
  );
};

interface IconProps {
  active: boolean;
}

const Icon = ({ active }: IconProps) =>
  active ? (
    <div className="relative">
      <BookmarkFillIcon aria-hidden className="opacity-100 group-hover/variant:opacity-0" />
      <XMarkIcon aria-hidden className="absolute top-0 left-0 opacity-0 group-hover/variant:opacity-100" />
    </div>
  ) : (
    <BookmarkIcon aria-hidden />
  );

const getActiveBookmark = (text: FormattedText | undefined): Omit<Bookmark, 'nodes'> | null => {
  if (text === undefined) {
    return null;
  }

  for (const key in text) {
    if (key.startsWith(BOOKMARK_PREFIX)) {
      const variant = text[key];

      if (typeof variant === 'string' && isBookmarkVariant(variant)) {
        return { key, variant };
      }

      return null;
    }
  }

  return null;
};

interface BookmarkVariantButtonProps {
  option: BookmarkVariant;
  onClick: () => void;
}

const BookmarkVariantButton = ({ option, onClick }: BookmarkVariantButtonProps) => (
  <Tooltip content={option.name} key={option.variant} placement="left">
    <Button
      data-color="neutral"
      onClick={onClick}
      size="small"
      variant="tertiary"
      icon={<BookmarkFillIcon aria-hidden className={option.className} />}
    />
  </Tooltip>
);
