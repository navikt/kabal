import { SmartEditorContext } from '@app/components/smart-editor/context';
import { DEFAULT, EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { isMetaKey, Keys } from '@app/keys';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { useMyPlateEditorRef } from '@app/plate/types';
import { BoxNew, HGrid } from '@navikt/ds-react';
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

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const lowerCaseKey = event.key.toLowerCase();

    if (!isMetaKey(event)) {
      return;
    }

    if (event.shiftKey && lowerCaseKey === Keys.G) {
      event.preventDefault();
      setShowGodeFormuleringer(!showGodeFormuleringer);

      return;
    }

    if (!event.shiftKey && lowerCaseKey === Keys.K) {
      event.preventDefault();
      setNewCommentSelection(editor.selection);

      return;
    }

    if (event.key === Keys.Plus || event.key === Keys.Equals) {
      event.preventDefault();
      scaleUp();

      return;
    }

    if (event.key === Keys.Dash) {
      event.preventDefault();
      scaleDown();

      return;
    }

    if (event.key === Keys.Zero) {
      event.preventDefault();
      setScale(DEFAULT);
    }
  };

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (isMetaKey(e)) {
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
    <BoxNew asChild background="default" paddingBlock="space-16 0" paddingInline="space-16 0" height="max-content">
      <HGrid
        position="relative"
        overflow="visible"
        columns={showAnnotationsAtOrigin ? 'min-content min-content min-content' : 'min-content min-content'}
        style={{
          gridTemplateRows: showAnnotationsAtOrigin
            ? 'min-content 1fr minmax(200px, min-content)'
            : '1fr minmax(200px, min-content)',
          gridTemplateAreas: showAnnotationsAtOrigin
            ? "'content counters counters' 'content bookmarks comments' 'padding bookmarks comments'"
            : "'content right' 'padding right'",
        }}
        onKeyDown={onKeyDown}
        ref={ref}
        className="scroll-pt-16 underline-offset-[.25em]"
      >
        {children}
        <div
          role="presentation"
          aria-hidden
          style={{ gridArea: 'padding', paddingBottom: `calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 100px)` }}
          className="h-0"
        />
      </HGrid>
    </BoxNew>
  );
};
