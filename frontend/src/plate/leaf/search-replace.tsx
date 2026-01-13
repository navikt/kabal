import { AppTheme, useAppTheme } from '@app/app-theme';
import { PlateLeaf, type PlateLeafProps } from 'platejs/react';
import type { ReactElement } from 'react';

export const AllSearchHitsHighlightLeaf = (props: PlateLeafProps): ReactElement => {
  const theme = useAppTheme();

  switch (theme) {
    case AppTheme.LIGHT:
      return <PlateLeaf {...props} className="bg-ax-bg-warning-moderate-pressed" />;
    case AppTheme.DARK:
      return <PlateLeaf {...props} className="bg-ax-bg-warning-strong" />;
  }
};

export const ReplaceOneHighlightLeaf = (props: PlateLeafProps) => (
  <PlateLeaf {...props} className="bg-ax-bg-accent-strong text-ax-text-accent-contrast" />
);
