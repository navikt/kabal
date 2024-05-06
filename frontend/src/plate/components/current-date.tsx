import {
  PlateElement,
  PlateRenderElementProps,
  setNodes,
  useEditorReadOnly,
  useEditorRef,
} from '@udecode/plate-common';
import { parseISO } from 'date-fns';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { formatLongDate, zeroPad } from '@app/domain/date';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import { CurrentDateElement, EditorValue, useMyPlateEditorRef } from '@app/plate/types';

type Props = PlateRenderElementProps<EditorValue, CurrentDateElement>;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

export const CurrentDate = ({ element, ...props }: Props) => {
  const editor = useMyPlateEditorRef();
  const readOnly = useEditorReadOnly(editor.id);
  const [now, setNow] = useState(element.date === undefined ? new Date() : parseISO(element.date));

  useEffect(() => {
    if (readOnly) {
      return;
    }

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

  return <RenderCurrentDate element={element} {...props} {...parts} />;
};

const RenderCurrentDate = memo<Props & DateParts>(
  ({ year, month, day, children, attributes, element }) => {
    const editor = useEditorRef();
    const readOnly = useEditorReadOnly(editor.id);
    const isSelected = useSelected();

    const isoDate = `${year}-${zeroPad(month + 1)}-${zeroPad(day)}`;

    useEffect(() => {
      if (readOnly || element.date === isoDate) {
        return;
      }

      setNodes(editor, { date: isoDate }, { match: (n) => n === element, at: [], mode: 'highest' });
    }, [editor, element, isoDate, readOnly]);

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
          <span>
            {element.date === undefined
              ? `Dato: se dato i listen til venstre`
              : `Dato: ${formatLongDate(year, month, day)}`}
          </span>
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
  outline-width: ${ptToEm(6)};
  margin-top: 1em;
`;
