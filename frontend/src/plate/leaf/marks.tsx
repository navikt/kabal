import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react';

export const BoldLeaf = (props: PlateLeafProps<FormattedText>) => (
  <PlateLeaf {...props} style={{ fontWeight: 'bold' }} />
);

export const ItalicLeaf = (props: PlateLeafProps<FormattedText>) => (
  <PlateLeaf {...props} style={{ fontStyle: 'italic' }} />
);

export const UnderlineLeaf = (props: PlateLeafProps<FormattedText>) => (
  <PlateLeaf {...props} style={{ textDecoration: 'underline' }} />
);
