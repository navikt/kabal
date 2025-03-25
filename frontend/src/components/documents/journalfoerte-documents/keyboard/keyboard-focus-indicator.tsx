import type {
  DokumentRenderData,
  VedleggRenderData,
} from '@app/components/documents/journalfoerte-documents/calculate';
import { convertAccessibleToRealDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useKeyboardFocusState } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useEffect, useRef } from 'react';

interface Props {
  dokumenterList: DokumentRenderData[];
  onScrollTo: (top: DokumentRenderData | VedleggRenderData) => void;
}

export const KeyboardFocusIndicator = ({ dokumenterList, onScrollTo }: Props) => {
  const focusIndicatorRef = useRef<HTMLDivElement>(null);
  const { focusedDocument, focusedVedlegg } = useFocusedDocument(dokumenterList);

  useEffect(() => {
    if (focusedDocument === null && focusedVedlegg === null) {
      return;
    }

    requestAnimationFrame(() => {
      if (focusIndicatorRef.current === null) {
        return;
      }

      onScrollTo(focusedVedlegg ?? focusedDocument);

      const { globalTop } = focusedVedlegg ?? focusedDocument;

      focusIndicatorRef.current.style.transform = `translateY(${globalTop}px)`;
      focusIndicatorRef.current.style.left = focusedVedlegg === null ? '2px' : '28px';
    });
  }, [focusedVedlegg, focusedDocument, onScrollTo]);

  if (focusedDocument === null && focusedVedlegg === null) {
    return null;
  }

  return (
    <div
      ref={focusIndicatorRef}
      key="keyboard-focus-indicator"
      role="presentation"
      style={{ left: '2px', transform: 'translateY(0px)' }}
      className="pointer-events-none absolute top-2 right-1 h-8 select-none rounded-medium bg-surface-hover outline-2 outline-border-focus"
    />
  );
};

interface FocusedVedlegg {
  focusedDocument: DokumentRenderData;
  focusedVedlegg: VedleggRenderData;
}

interface FocusedDocument {
  focusedDocument: DokumentRenderData;
  focusedVedlegg: null;
}

interface NoFocusedDocument {
  focusedDocument: null;
  focusedVedlegg: null;
}

type FocusedDocumentResult = FocusedVedlegg | FocusedDocument | NoFocusedDocument;

const useFocusedDocument = (dokumenterList: DokumentRenderData[]): FocusedDocumentResult => {
  const [accessibleDocumentIndex, focusedVedleggIndex] = useKeyboardFocusState();

  if (accessibleDocumentIndex === -1) {
    return { focusedDocument: null, focusedVedlegg: null };
  }

  const d = dokumenterList[convertAccessibleToRealDocumentIndex(accessibleDocumentIndex)];

  if (d === undefined) {
    return { focusedDocument: null, focusedVedlegg: null };
  }

  if (focusedVedleggIndex === -1) {
    return { focusedDocument: d, focusedVedlegg: null };
  }

  const v = d.vedleggList.list[focusedVedleggIndex];

  if (v === undefined) {
    return { focusedDocument: d, focusedVedlegg: null };
  }

  return { focusedDocument: d, focusedVedlegg: v };
};
