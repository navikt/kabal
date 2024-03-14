import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { DEFAULT, useScaleState } from '@app/components/smart-editor/hooks/use-scale';
import { PlateEditorContent } from '@app/plate/styled-components';
import { useMyPlateEditorRef } from '@app/plate/types';

export const Content = ({ children }: { children?: React.ReactNode }) => {
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer, setNewCommentSelection, showAnnotationsAtOrigin } =
    useContext(SmartEditorContext);
  const { scaleUp, scaleDown, setValue } = useScaleState();

  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const lowerCaseKey = event.key.toLowerCase();

    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }

    if (event.shiftKey && lowerCaseKey === 'f') {
      event.preventDefault();
      setShowGodeFormuleringer(!showGodeFormuleringer);

      return;
    }

    if (!event.shiftKey && lowerCaseKey === 'k') {
      event.preventDefault();
      setNewCommentSelection(editor.selection);

      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      scaleUp();

      return;
    }

    if (event.key === '-') {
      event.preventDefault();
      scaleDown();

      return;
    }

    if (event.key === '0') {
      event.preventDefault();
      setValue(DEFAULT);
    }
  };

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        if (e.deltaY > 0) {
          scaleDown();
        } else {
          scaleUp();
        }
      }
    },
    [scaleDown, scaleUp],
  );

  useEffect(() => {
    const element = ref.current;

    if (element === null) {
      return;
    }

    element.addEventListener('wheel', onWheel, { passive: false });

    return () => element.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <PlateEditorContent onKeyDown={onKeyDown} ref={ref} $showAnnotationsAtOrigin={showAnnotationsAtOrigin}>
      {children}
    </PlateEditorContent>
  );
};
