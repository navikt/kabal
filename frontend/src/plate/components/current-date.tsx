import { formatLongDate, zeroPad } from '@app/domain/date';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import type { CurrentDateElement } from '@app/plate/types';
import { BoxNew } from '@navikt/ds-react';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSelected } from 'slate-react';

type Props = PlateElementProps<CurrentDateElement>;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

export const CurrentDate = (props: Props) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const millisecondsToNextDay = 86400000 - (now.getTime() % 86400000);
    const timeout = setTimeout(() => setNow(new Date()), millisecondsToNextDay);

    return () => clearTimeout(timeout);
  });

  const parts = useMemo<DateParts>(
    () => ({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    }),
    [now],
  );

  return <RenderCurrentDate {...props} {...parts} />;
};

const RenderCurrentDate = memo<Props & DateParts>(
  ({ year, month, day, children, ...props }) => {
    const isSelected = useSelected();

    const isoDate = `${year}-${zeroPad(month + 1)}-${zeroPad(day)}`;

    return (
      <PlateElement<CurrentDateElement>
        {...props}
        as="div"
        attributes={{
          ...props.attributes,
          contentEditable: false,
          suppressContentEditableWarning: true,
          onDragStart: (event) => event.preventDefault(),
          onDrop: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }}
      >
        {children}
        <BoxNew
          as="time"
          dateTime={isoDate}
          contentEditable={false}
          width="100%"
          borderRadius="medium"
          background={isSelected ? 'neutral-soft' : undefined}
          style={{
            marginTop: '1em',
            outlineWidth: ptToEm(6),
            outlineStyle: 'solid',
            outlineColor: isSelected ? 'var(--ax-bg-neutral-soft)' : 'transparent',
          }}
          className="block text-right transition-colors duration-200 ease-in-out"
        >
          <span>Dato: {formatLongDate(year, month, day)}</span>
        </BoxNew>
      </PlateElement>
    );
  },
  (prevProps, nextProps) =>
    prevProps.year === nextProps.year && prevProps.month === nextProps.month && prevProps.day === nextProps.day,
);

RenderCurrentDate.displayName = 'RenderCurrentDate';
