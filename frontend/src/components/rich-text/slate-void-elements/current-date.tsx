import React, { memo, useEffect, useMemo, useState } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import styled from 'styled-components';
import { formatLongDate, zeroPad } from '@app/domain/date';

interface DateParts {
  year: number;
  month: number;
  day: number;
}

export const CurrentDate = (props: RenderElementProps) => {
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
    [now]
  );

  return <RenderCurrentDate {...props} {...parts} />;
};

interface Props extends RenderElementProps, DateParts {}

const RenderCurrentDate = memo<Props>(
  ({ year, month, day, children, attributes }) => {
    const isSelected = useSelected();

    const isoDate = `${year}-${zeroPad(month + 1)}-${zeroPad(day)}`;

    return (
      <div {...attributes} contentEditable={false}>
        {children}
        <CurrentDateContainer dateTime={isoDate} $isFocused={isSelected} contentEditable={false}>
          <span>Dato: {formatLongDate(year, month, day)}</span>
        </CurrentDateContainer>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.year === nextProps.year && prevProps.month === nextProps.month && prevProps.day === nextProps.day
);

RenderCurrentDate.displayName = 'RenderCurrentDate';

const CurrentDateContainer = styled.time<{ $isFocused: boolean }>`
  display: block;
  text-align: right;
  width: 100%;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-style: solid;
  outline-width: 8px;
`;
