import { PlateLeaf, type PlateLeafProps } from 'platejs/react';

export const AllSearchHitsHighlightLeaf = (props: PlateLeafProps) => (
  <PlateLeaf {...props} className="bg-ax-bg-warning-moderate-pressed" />
);

export const ReplaceOneHighlightLeaf = (props: PlateLeafProps) => (
  <PlateLeaf {...props} className="bg-ax-bg-accent-moderate-pressed" />
);
