import { PlateElement, PlateRenderElementProps, usePlateEditorRef } from '@udecode/plate-common';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { formatLongDate, zeroPad } from '@app/domain/date';
import { CurrentDateElement, EditorValue } from '@app/plate/types';

type Props = PlateRenderElementProps<EditorValue, CurrentDateElement>;

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
  ({ year, month, day, children, attributes, element }) => {
    const editor = usePlateEditorRef();
    const isSelected = useSelected();

    const isoDate = `${year}-${zeroPad(month + 1)}-${zeroPad(day)}`;

    return (
      <PlateElement
        as="div"
        attributes={attributes}
        element={element}
        editor={editor}
        contentEditable={false}
        suppressContentEditableWarning
        onDragStart={(event) => event.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
        <CurrentDateContainer dateTime={isoDate} $isFocused={isSelected} contentEditable={false}>
          <span>Dato: {formatLongDate(year, month, day)}</span>
        </CurrentDateContainer>
      </PlateElement>
    );
  },
  (prevProps, nextProps) =>
    prevProps.year === nextProps.year && prevProps.month === nextProps.month && prevProps.day === nextProps.day,
);

RenderCurrentDate.displayName = 'RenderCurrentDate';

const CurrentDateContainer = styled.time<{ $isFocused: boolean }>`
  display: block;
  text-align: right;
  width: 100%;
  border-radius: 2px;
  transition:
    background-color 0.2s ease-in-out,
    outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-style: solid;
  outline-width: 8px;
  margin-top: 12pt;
`;
