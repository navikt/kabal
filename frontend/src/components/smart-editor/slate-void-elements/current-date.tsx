import React from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import styled from 'styled-components';
import { formatLongDate, zeroPad } from '../../../domain/date';

export const CurrentDate = (props: RenderElementProps) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  return <RenderCurrentDate {...props} year={year} month={month} day={day} />;
};

interface Props extends RenderElementProps {
  year: number;
  month: number;
  day: number;
}

const RenderCurrentDate = React.memo<Props>(
  ({ year, month, day, children, attributes }) => {
    const isSelected = useSelected();

    const isoDate = `${year}-${zeroPad(month + 1)}-${zeroPad(day)}`;

    return (
      <div {...attributes}>
        {children}
        <CurrentDateContainer dateTime={isoDate} isFocused={isSelected} contentEditable={false}>
          <span>Dato: {formatLongDate(year, month, day)}</span>
        </CurrentDateContainer>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.year === nextProps.year && prevProps.month === nextProps.month && prevProps.day === nextProps.day
);

RenderCurrentDate.displayName = 'RenderCurrentDate';

const CurrentDateContainer = styled.time<{ isFocused: boolean }>`
  display: block;
  text-align: right;
  width: 100%;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;
  background-color: ${({ isFocused }) => (isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ isFocused }) => (isFocused ? '#f5f5f5' : 'transparent')};
  outline-style: solid;
  outline-width: 8px;
`;
