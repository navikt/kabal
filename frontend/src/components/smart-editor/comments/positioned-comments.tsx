import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import {
  ItemType,
  PositionedItem,
  ThreadData,
  getPositionedItems,
} from '@app/components/smart-editor/functions/get-positioned-items';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useThreads } from '../comments/use-threads';
import { ExpandableThread } from './expandable-thread';

const ITEM_WIDTH = 350;
const ITEM_OFFSET = 32;
const MIN_OFFSET = 16;

const EMPTY_LIST: PositionedItem<ThreadData>[] = [];

export const PositionedComments = () => {
  const { attached, orphans } = useThreads();
  const { sheetRef, showAnnotationsAtOrigin, addComponentLoadListener } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();

  const calulateItems = useCallback((): {
    positionedItems: PositionedItem<ThreadData>[];
    maxCount: number;
  } => {
    if (!showAnnotationsAtOrigin) {
      return { positionedItems: EMPTY_LIST, maxCount: 0 };
    }

    const threads = attached.map<ThreadData>((a) => ({ ...a, type: ItemType.THREAD }));

    const p = getPositionedItems(editor, threads, sheetRef);

    return {
      positionedItems: p.positionedItems,
      maxCount: Math.max(p.maxCount, orphans.length),
    };
  }, [attached, editor, orphans.length, sheetRef, showAnnotationsAtOrigin]);

  const [{ positionedItems, maxCount }, setItems] = useState(calulateItems());

  useEffect(() => {
    addComponentLoadListener(() => {
      console.log('onComponentLoad');
      setItems(calulateItems());
    });
  }, [addComponentLoadListener, calulateItems]);

  return (
    <Container style={{ width: maxCount * ITEM_OFFSET + ITEM_WIDTH + MIN_OFFSET }}>
      {positionedItems.map(({ data, top, floorIndex }) => (
        <ExpandableThread
          key={data.id}
          thread={data}
          isFocused={data.isFocused}
          style={{ top: `${top}em`, left: floorIndex * ITEM_OFFSET + MIN_OFFSET }}
          isAbsolute
        />
      ))}
    </Container>
  );
};

const Container = styled.section`
  grid-area: comments;
  position: relative;
  z-index: 0;
  margin-left: 0;
  font-size: calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt);
`;
