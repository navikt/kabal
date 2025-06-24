import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from 'platejs/react';

export const BoldLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="font-bold" />;

export const ItalicLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="italic" />;

export const UnderlineLeaf = (props: PlateLeafProps<FormattedText>) => <PlateLeaf {...props} className="underline" />;
