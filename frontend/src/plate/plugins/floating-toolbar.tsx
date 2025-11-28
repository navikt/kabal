import { FloatingRedaktoerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-redaktoer-toolbar-buttons';
import { FloatingSaksbehandlerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-saksbehandler-toolbar-buttons';
import { BoxNew } from '@navikt/ds-react';
import { createPlatePlugin, useEditorContainerRef, useEditorId, useEventEditorValue } from '@platejs/core/react';
import { flip, offset, useFloatingToolbar, useFloatingToolbarState } from '@platejs/floating';
import { useComposedRef } from 'platejs/react';
import { type ReactNode, useEffect, useState } from 'react';

export const FloatingSaksbehandlerToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingSaksbehandlerToolbarButtons />
      </FloatingToolbar>
    ),
  },
});

export const FloatingRedaktørToolbarPlugin = createPlatePlugin({
  key: 'floating-redaktør-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingRedaktoerToolbarButtons />
      </FloatingToolbar>
    ),
  },
});

const FloatingToolbar = ({ children }: { children: ReactNode }) => {
  const editorId = useEditorId();
  const focusedEditorId = useEventEditorValue('focus');
  const isDragging = useIsDragging();

  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    hideToolbar: isDragging,
    floatingOptions: {
      placement: 'top-start',
      middleware: [offset({ mainAxis: OFFSET_TOP }), flip({ fallbackPlacements: ['top-end'] })],
    },
    showWhenReadOnly: false,
  });

  const { hidden, props, ref: floatingRef } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(null, floatingRef);

  if (hidden) {
    return null;
  }

  return (
    <BoxNew
      {...props}
      ref={ref}
      as="section"
      shadow="dialog"
      background="default"
      padding="05"
      className="flex flex-nowrap"
    >
      {children}
    </BoxNew>
  );
};

const useIsDragging = (): boolean => {
  const [isDragging, setIsDragging] = useState(false);
  const ref = useEditorContainerRef();
  const { current } = ref;

  useEffect(() => {
    if (current === null) {
      return;
    }

    const onDragStart = () => setIsDragging(true);
    const onDragEnd = () => setIsDragging(false);

    current.addEventListener('dragstart', onDragStart);
    current.addEventListener('dragend', onDragEnd);
    current.addEventListener('drop', onDragEnd);

    return () => {
      current.removeEventListener('dragstart', onDragStart);
      current.removeEventListener('dragend', onDragEnd);
      current.removeEventListener('drop', onDragEnd);
    };
  }, [current]);

  return isDragging;
};

const OFFSET_TOP = 8;
