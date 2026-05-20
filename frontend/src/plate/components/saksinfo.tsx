import { PlateElement, type PlateElementProps } from 'platejs/react';
import { formatLongDate } from '@/domain/date';
import { pxToEm } from '@/plate/components/get-scaled-em';
import type { SaksinfoElement } from '@/plate/types';

export const Saksinfo = (props: PlateElementProps<SaksinfoElement>) => {
  const { children, ...rest } = props;

  return (
    <PlateElement<SaksinfoElement> {...rest} as="div">
      <div
        className="flex items-end justify-between"
        style={{ marginTop: pxToEm(48), marginBottom: pxToEm(48), fontSize: pxToEm(11) }}
      >
        <div>{children}</div>
        <span>{formatLongDate(YEAR, MONTH, DAY)}</span>
      </div>
    </PlateElement>
  );
};

const NOW = new Date();
const YEAR = NOW.getFullYear();
const MONTH = NOW.getMonth();
const DAY = NOW.getDate();
