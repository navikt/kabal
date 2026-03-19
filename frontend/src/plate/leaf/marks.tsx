import { PlateLeaf, type PlateLeafProps } from 'platejs/react';
import type { FormattedText } from '@/plate/types';

export const BoldLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="font-ax-bold" />;

export const ItalicLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="italic" />;

export const UnderlineLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="underline" />;
