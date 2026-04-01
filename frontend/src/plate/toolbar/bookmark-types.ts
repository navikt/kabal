export enum BookmarkVariantEnum {
  RED = '1',
  GREEN = '2',
  PURPLE = '3',
}

const BOOKMARK_VARIANT_VALUES = Object.values(BookmarkVariantEnum);

export const isBookmarkVariant = (value: string): value is BookmarkVariantEnum =>
  BOOKMARK_VARIANT_VALUES.includes(value as BookmarkVariantEnum);

export interface BookmarkVariant {
  variant: BookmarkVariantEnum;
  name: string;
  className: string;
}

export const BOOKMARK_VARIANTS: [BookmarkVariant, BookmarkVariant, BookmarkVariant] = [
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
