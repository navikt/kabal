import { CURRENT_SCALE } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE_PX } from '@app/plate/components/get-scaled-em';
import { getRangePosition } from '@app/plate/functions/get-range-position';
import type { IRangePosition } from '@app/plate/functions/range-position';
import { useSelection } from '@app/plate/hooks/use-selection';
import { FloatingRedaktoerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-redaktoer-toolbar-buttons';
import { FloatingSaksbehandlerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-saksbehandler-toolbar-buttons';
import { useMyPlateEditorRef } from '@app/plate/types';
import { Box, HStack } from '@navikt/ds-react';
import { BaseTablePlugin } from '@udecode/plate-table';
import { useMemo, useState } from 'react';

interface Props {
  editorId: string;
  container: HTMLDivElement | null;
}

interface FloatingToolbarProps extends Props {
  children: React.ReactNode;
}

const FLOATING_TOOLBAR_OFFSET = 8;
const FLOATING_TOOLBAR_HEIGHT = 36;

const OFFSET = FLOATING_TOOLBAR_OFFSET + FLOATING_TOOLBAR_HEIGHT;

const FloatingToolbar = ({ editorId, container, children }: FloatingToolbarProps) => {
  const editor = useMyPlateEditorRef();
  const [toolbarRef, setRef] = useState<HTMLElement | null>(null);
  const selection = useSelection(editorId);
  const isInTable = editor.api.some({ match: { type: BaseTablePlugin.node.type } });
  const position = getRangePosition(editor, isInTable ? null : selection, container);
  const isFocused = editor.api.isFocused();

  const horizontalPosition = useMemo(
    () => getHorizontalPosition(toolbarRef, container, position),
    [container, position, toolbarRef],
  );

  if (isInTable || !isFocused || position === null || editor.api.isCollapsed()) {
    return null;
  }

  return (
    <HStack
      asChild
      align="center"
      position="absolute"
      className="z-21"
      style={{
        willChange: 'left, right, top',
        top: `calc(${position.top}em - ${OFFSET}px)`,
        left: horizontalPosition.left === undefined ? undefined : `${horizontalPosition.left}em`,
        right: horizontalPosition.right === undefined ? undefined : `${horizontalPosition.right}em`,
      }}
      ref={setRef}
    >
      <Box as="section" shadow="medium" background="surface-default" padding="05">
        {children}
      </Box>
    </HStack>
  );
};

const getHorizontalPosition = (
  toolbarRef: HTMLElement | null,
  container: HTMLDivElement | null,
  position: IRangePosition | null,
) => {
  if (toolbarRef === null || container === null || position === null) {
    return {};
  }

  const maxLeft = (container.offsetWidth - toolbarRef.offsetWidth) / CURRENT_SCALE / BASE_FONT_SIZE_PX;

  return position.left > maxLeft ? { right: 0 } : { left: position.left };
};

export const FloatingSaksbehandlerToolbar = (props: Props) => (
  <FloatingToolbar {...props}>
    <FloatingSaksbehandlerToolbarButtons />
  </FloatingToolbar>
);

export const FloatingRedaktoerToolbar = (props: Props) => (
  <FloatingToolbar {...props}>
    <FloatingRedaktoerToolbarButtons />
  </FloatingToolbar>
);
