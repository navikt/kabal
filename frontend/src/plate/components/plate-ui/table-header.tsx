import { PlateElement, type PlateElementProps } from 'platejs/react';
import { AppTheme, useAppTheme } from '@/app-theme';
import type { TableHeaderElement } from '@/plate/types';

const REMOVE_P_MARGIN_TOP = '[&>*:first-child]:mt-0!';

export const TableHeaderComponent = ({ children, ref, ...props }: PlateElementProps<TableHeaderElement>) => {
  const borderColor = useBorderColor();

  return (
    <PlateElement
      as="th"
      ref={ref}
      {...props}
      className={`${REMOVE_P_MARGIN_TOP} ${borderColor} border bg-ax-accent-200 p-2 text-left font-semibold`}
    >
      {children}
    </PlateElement>
  );
};

const useBorderColor = (): string => {
  const theme = useAppTheme();

  switch (theme) {
    case AppTheme.LIGHT:
      return 'border-[#000]';
    case AppTheme.DARK:
      return 'border-[#fff]';
  }
};
