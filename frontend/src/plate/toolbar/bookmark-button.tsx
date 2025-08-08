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

  const setBookmark = (variant: BookmarkVariantEnum) => {
    const id = BOOKMARK_PREFIX + Date.now();
    editor.tf.setNodes({ [BookmarkPlugin.key]: true, [id]: variant }, { match: TextApi.isText, split: true });

    const entries = editor.nodes<FormattedText>({ match: (n) => TextApi.isText(n) && id in n });
    const nodes: FormattedText[] = [];

    for (const [node] of entries) {
      nodes.push(node);
    }
  };

  const activeEntry = editor.api.node<FormattedText>({
    match: (n) => TextApi.isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
  });

  const activeBookmarkVariant = getActiveBookmarkVariant(activeEntry?.[0]);

  useOnClickOutside(ref, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const active = activeBookmarkVariant !== null;
  const Icon = active ? BookmarkFillIcon : BookmarkIcon;
  const label = active ? 'Bytt bokmerke' : 'Sett bokmerke';

  return (
    <div ref={ref} className="relative text-[12pt]">
      <ToolbarIconButton
        label={label}
        icon={<Icon aria-hidden />}
        onClick={() => setIsOpen(!isOpen)}
        active={active}
        disabled={disabled}
        className={activeBookmarkVariant === null ? undefined : BOOKMARK_VARIANT_TO_CLASSNAME[activeBookmarkVariant]}
        variant="tertiary-neutral"
      />
      {isOpen ? (
        <HStack asChild position="absolute" right="0" style={{ top: '100%' }}>
          <BoxNew background="default" padding="1" shadow="dialog" borderRadius="medium">
            {BOOKMARK_VARIANTS.map((option) => (
              <Bookmark key={option.variant} option={option} setIsOpen={setIsOpen} setBookmark={setBookmark} />
            ))}
          </BoxNew>
        </HStack>
      ) : null}
    </div>
  );
};

const getActiveBookmarkVariant = (text: FormattedText | undefined): BookmarkVariantEnum | null => {
  if (text === undefined) {
    return null;
  }

  for (const key in text) {
    if (key.startsWith(BOOKMARK_PREFIX)) {
      const value = text[key];

      if (typeof value === 'string' && isBookmarkVariant(value)) {
        return value;
      }

      return null;
    }
  }

  return null;
};

interface BookmarkProps {
  option: BookmarkVariant;
  setIsOpen: (open: boolean) => void;
  setBookmark: (variant: BookmarkVariantEnum) => void;
}

const Bookmark = ({ option, setIsOpen, setBookmark }: BookmarkProps) => (
  <Tooltip content={option.name} key={option.variant}>
    <Button
      onClick={() => {
        pushEvent('set-bookmark', 'smart-editor', { color: option.name });
        setBookmark(option.variant);
        setIsOpen(false);
      }}
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
    className: 'text-ax-text-danger-decoration bg-ax-bg-danger-soft-a rounded-sm hover:bg-ax-bg-danger-moderate',
  },
  {
    variant: BookmarkVariantEnum.GREEN,
    name: 'Grønn',
    className: 'text-ax-text-success-decoration bg-ax-bg-success-soft-a rounded-sm hover:bg-ax-bg-success-moderate',
  },
  {
    variant: BookmarkVariantEnum.PURPLE,
    name: 'Lilla',
    className:
      'text-ax-text-meta-purple-decoration bg-ax-bg-meta-purple-soft-a rounded-sm hover:bg-ax-bg-meta-purple-moderate',
  },
];

export const BOOKMARK_VARIANT_TO_CLASSNAME: Record<BookmarkVariantEnum, string> = {
  [BookmarkVariantEnum.RED]: BOOKMARK_VARIANTS[0].className,
  [BookmarkVariantEnum.GREEN]: BOOKMARK_VARIANTS[1].className,
  [BookmarkVariantEnum.PURPLE]: BOOKMARK_VARIANTS[2].className,
};
