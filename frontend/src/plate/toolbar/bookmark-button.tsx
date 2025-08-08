import type { Bookmark } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, BookmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, Tooltip } from '@navikt/ds-react';
import { TextApi } from 'platejs';
import { useRef, useState } from 'react';

export const BookmarkButton = () => {
  const editor = useMyPlateEditorState();
  const disabled = useIsUnchangeable();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const setBookmark = (variant: BookmarkVariantEnum) => {
    pushEvent('set-bookmark', 'smart-editor', { color: variant });
    const id = BOOKMARK_PREFIX + Date.now();
    editor.tf.setNodes({ [BookmarkPlugin.key]: true, [id]: variant }, { match: TextApi.isText, split: true });

    const entries = editor.nodes<FormattedText>({ match: (n) => TextApi.isText(n) && id in n });
    const nodes: FormattedText[] = [];

    for (const [node] of entries) {
      nodes.push(node);
    }
  };

  const removeBookmark = (bookmark: Omit<Bookmark, 'nodes'>) => {
    pushEvent('remove-bookmark', 'smart-editor', { color: bookmark.variant });
    editor.tf.unsetNodes<FormattedText>([BookmarkPlugin.key, bookmark.key], {
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
        <HStack asChild position="absolute" left="0" style={{ top: '100%' }}>
          <BoxNew background="default" padding="0" shadow="dialog" borderRadius="medium">
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
          </BoxNew>
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
      onClick={onClick}
      size="small"
      variant="tertiary-neutral"
      icon={<BookmarkFillIcon aria-hidden className={option.className} />}
    />
  </Tooltip>
);

export enum BookmarkVariantEnum {
  RED = '1',
  GREEN = '2',
  PURPLE = '3',
}

const BOOKMARK_VARIANT_VALUES = Object.values(BookmarkVariantEnum);

export const isBookmarkVariant = (value: string): value is BookmarkVariantEnum =>
  BOOKMARK_VARIANT_VALUES.includes(value as BookmarkVariantEnum);

interface BookmarkVariant {
  variant: BookmarkVariantEnum;
  name: string;
  className: string;
}

const BOOKMARK_VARIANTS: [BookmarkVariant, BookmarkVariant, BookmarkVariant] = [
  {
    variant: BookmarkVariantEnum.RED,
    name: 'Rød',
    className: 'text-ax-text-danger-decoration bg-ax-bg-danger-soft-a hover:bg-ax-bg-danger-moderate-a',
  },
  {
    variant: BookmarkVariantEnum.GREEN,
    name: 'Grønn',
    className: 'text-ax-text-success-decoration bg-ax-bg-success-soft-a hover:bg-ax-bg-success-moderate-a',
  },
  {
    variant: BookmarkVariantEnum.PURPLE,
    name: 'Lilla',
    className: 'text-ax-text-meta-purple-decoration bg-ax-bg-meta-purple-soft-a hover:bg-ax-bg-meta-purple-moderate-a',
  },
];

export const BOOKMARK_VARIANT_TO_CLASSNAME: Record<BookmarkVariantEnum, string> = {
  [BookmarkVariantEnum.RED]: BOOKMARK_VARIANTS[0].className,
  [BookmarkVariantEnum.GREEN]: BOOKMARK_VARIANTS[1].className,
  [BookmarkVariantEnum.PURPLE]: BOOKMARK_VARIANTS[2].className,
};
