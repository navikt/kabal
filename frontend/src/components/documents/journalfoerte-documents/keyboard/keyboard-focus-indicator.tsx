import type { DokumentRenderData } from '@app/components/documents/journalfoerte-documents/calculate';
import { convertAccessibleToRealDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useKeyboardFocusState } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useSelectionRangesState } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { rangesToIndexes } from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { memo, useEffect, useMemo, useRef } from 'react';

interface Props {
  dokumenterList: DokumentRenderData[];
  onScrollTo: (globalTop: number) => void;
}

export const KeyboardFocusIndicator = memo(
  (props: Props) => (
    <>
      <Focus key="focus" {...props} />
      <Selection key="selection" {...props} />
    </>
  ),
  (prev, next) => prev.onScrollTo === next.onScrollTo && prev.dokumenterList === next.dokumenterList,
);

KeyboardFocusIndicator.displayName = 'KeyboardFocusIndicator';

const Focus = memo(
  ({ dokumenterList, onScrollTo }: Props) => {
    const position = useFocusedPosition(dokumenterList);
    const globalTop = position?.globalTop ?? 0;

    // Scroll to the focus whever the focus is moved vertically.
    useEffect(() => {
      onScrollTo(globalTop);
    }, [globalTop, onScrollTo]);

    return position === null ? null : <FocusHighlight {...position} />;
  },
  (prev, next) => prev.onScrollTo === next.onScrollTo && prev.dokumenterList === next.dokumenterList,
);

Focus.displayName = 'Focus';

const BASE_CLASSES = 'pointer-events-none absolute top-0 right-0 h-8 select-none rounded-medium ';
const FOCUS_CLASSES = `${BASE_CLASSES} outline-2 -outline-offset-2 outline-border-focus transition-[transform,left] duration-25 ease-in-out`;
const getLeft = (isVedlegg: boolean) => (isVedlegg ? '62px' : '0');

interface FocusHighlightProps {
  globalTop: number;
  isVedlegg: boolean;
}

const FocusHighlight = ({ globalTop, isVedlegg }: FocusHighlightProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      role="presentation"
      className={FOCUS_CLASSES}
      style={{ transform: `translateY(${globalTop}px)`, left: getLeft(isVedlegg) }}
    />
  );
};

const SELECTION_CLASSES = `${BASE_CLASSES} bg-surface-active`;

interface SelectionProps {
  dokumenterList: DokumentRenderData[];
}

const Selection = ({ dokumenterList }: SelectionProps) => {
  const positions = useSelectedPositions(dokumenterList);

  return positions.map(({ globalTop, isVedlegg }) => (
    <div
      key={globalTop}
      role="presentation"
      style={{ left: getLeft(isVedlegg), transform: `translateY(${globalTop}px)` }}
      className={SELECTION_CLASSES}
    />
  ));
};

const useFocusedPosition = (dokumenterList: DokumentRenderData[]): GlobalPosition | null => {
  const accessibleDocumentIndex = useKeyboardFocusState();
  return useMemo(
    () => indexToGlobalTop(dokumenterList, accessibleDocumentIndex),
    [accessibleDocumentIndex, dokumenterList],
  );
};

const useSelectedPositions = (dokumenterList: DokumentRenderData[]): GlobalPosition[] => {
  const ranges = useSelectionRangesState();

  return rangesToIndexes(ranges)
    .map((accessibleDocumentIndex) => indexToGlobalTop(dokumenterList, accessibleDocumentIndex))
    .filter(isNotNull);
};

interface GlobalPosition {
  globalTop: number;
  isVedlegg: boolean;
}

const indexToGlobalTop = (
  dokumenterList: DokumentRenderData[],
  accessibleDocumentIndex: number,
): GlobalPosition | null => {
  const path = convertAccessibleToRealDocumentPath(accessibleDocumentIndex);

  if (path === null) {
    return null;
  }

  const [documentIndex, focusedVedleggIndex] = path;

  const d = dokumenterList[documentIndex];

  if (d === undefined) {
    return null;
  }

  if (focusedVedleggIndex === -1) {
    return { globalTop: d.globalTop, isVedlegg: false };
  }

  const v = d.vedleggList.list[focusedVedleggIndex];

  return v === undefined ? { globalTop: d.globalTop, isVedlegg: false } : { globalTop: v.globalTop, isVedlegg: true };
};
