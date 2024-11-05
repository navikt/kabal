import { SmartEditorContext } from '@app/components/smart-editor/context';
import { DEFAULT } from '@app/components/smart-editor/hooks/use-scale';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { PlateEditorContent } from '@app/plate/styled-components';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useCallback, useContext, useEffect, useRef } from 'react';

interface Props {
  children?: React.ReactNode;
}

export const Content = ({ children }: Props) => {
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer, setNewCommentSelection, showAnnotationsAtOrigin } =
    useContext(SmartEditorContext);
  const { scaleUp, scaleDown, setScale } = useContext(ScaleContext);

  const ref = useRef<HTMLDivElement>(null);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const lowerCaseKey = event.key.toLowerCase();

    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }

    if (event.shiftKey && lowerCaseKey === 'g') {
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
      setScale(DEFAULT);
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
