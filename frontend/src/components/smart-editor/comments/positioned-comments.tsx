import { SmartEditorContext } from '@app/components/smart-editor/context';
import {
  getPositionedItems,
  ItemType,
  type ThreadData,
} from '@app/components/smart-editor/functions/get-positioned-items';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { useMyPlateEditorState } from '@app/plate/types';
import { BoxNew } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import { useThreads } from '../comments/use-threads';
import { ExpandableThread } from './expandable-thread';

const ITEM_WIDTH = 350;
const ITEM_OFFSET = 32;
const MIN_OFFSET = 16;

export const PositionedComments = () => {
  const { attached, orphans } = useThreads();

  const { sheetRef, showAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState();

  const { positionedItems, maxCount } = useMemo(() => {
    if (!showAnnotationsAtOrigin) {
      return { positionedItems: [], maxCount: 0 };
    }

    const threads = attached
      .map<ThreadData>((a) => ({ ...a, type: ItemType.THREAD }))
      .toSorted((a, b) => a.created.localeCompare(b.created));

    const p = getPositionedItems(editor, threads, sheetRef.current);

    return {
      positionedItems: p.positionedItems,
      maxCount: Math.max(p.maxCount, orphans.length),
    };
  }, [showAnnotationsAtOrigin, attached, editor, sheetRef, orphans.length]);

  return (
    <BoxNew
      position="relative"
      style={{
        width: maxCount * ITEM_OFFSET + ITEM_WIDTH + MIN_OFFSET,
        gridArea: 'comments',
        fontSize: `calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt)`,
      }}
      className="z-0"
    >
      {positionedItems.map(({ data, top, floorIndex }, zIndex) => (
        <ExpandableThread
          key={data.id}
          thread={data}
          isFocused={data.isFocused}
          style={{ top: `${top}em`, left: floorIndex * ITEM_OFFSET + MIN_OFFSET }}
          zIndex={zIndex}
          isAbsolute
        />
      ))}
    </BoxNew>
  );
};
