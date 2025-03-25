import type { VedleggListRenderData } from '@app/components/documents/journalfoerte-documents/calculate';
import { ROW_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { AttachmentListItem } from '@app/components/documents/journalfoerte-documents/document/attachments/attachment-list';
import { setRealDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { JournalfoerteDocumentsAttachments } from '@app/components/documents/styled-components/attachment-list';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

interface Props {
  list: VedleggListRenderData;
  minTop: number;
  maxTop: number;
  dokument: IArkivertDocument;
  dokumentIndex: number;
  isSelected: (document: IJournalfoertDokumentId) => boolean;
  showLogiskeVedleggIdList: string[];
  setShowLogiskeVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

export const VedleggList = ({
  list,
  minTop,
  maxTop,
  dokument,
  dokumentIndex,
  isSelected,
  showLogiskeVedleggIdList,
  setShowLogiskeVedleggIdList,
}: Props) => {
  if (list.globalTop + list.height < minTop || list.globalTop > maxTop) {
    return null;
  }

  const { length } = list.list;

  if (length === 0) {
    return null;
  }

  const { journalpostId, journalstatus } = dokument;

  const vedleggNodeList: React.ReactNode[] = [];

  const lastIndex = length - 1;
  let treeLineHeight = ROW_HEIGHT / 2 + 1;

  for (const { globalTop, top, height, vedlegg, logiskeVedleggList, index } of list.list) {
    if (index !== lastIndex) {
      treeLineHeight += height;
    }

    if (globalTop + height < minTop || globalTop > maxTop) {
      continue;
    }

    const { dokumentInfoId, logiskeVedlegg } = vedlegg;
    const vedleggId = `${journalpostId}-${dokumentInfoId}`;
    const showVedleggList = showLogiskeVedleggIdList.includes(vedleggId);
    const selected = isSelected({ journalpostId, dokumentInfoId });

    vedleggNodeList.push(
      <AttachmentListItem
        key={`vedlegg_${vedleggId}`}
        role="treeitem"
        aria-selected={selected}
        aria-level={2}
        journalpostId={journalpostId}
        journalpoststatus={journalstatus}
        vedlegg={vedlegg}
        isSelected={selected}
        showVedlegg={showVedleggList}
        hasVedlegg={logiskeVedlegg.length > 0}
        toggleShowVedlegg={() =>
          setShowLogiskeVedleggIdList((ids) =>
            ids.includes(vedleggId) ? ids.filter((id) => id !== vedleggId) : [...ids, vedleggId],
          )
        }
        style={{ top, height }}
        aria-posinset={index}
        onClick={() => setRealDocumentPath(dokumentIndex, index)}
      >
        {showVedleggList ? (
          <LogiskeVedleggList
            list={logiskeVedleggList}
            minTop={minTop}
            maxTop={maxTop}
            left={32}
            connectTop={4}
            dokumentInfoId={dokumentInfoId}
            logiskeVedlegg={logiskeVedlegg}
            temaId={dokument.tema}
          />
        ) : null}
      </AttachmentListItem>,
    );
  }

  return (
    <JournalfoerteDocumentsAttachments
      // biome-ignore lint/a11y/useSemanticElements: Keyboard navigation.
      role="group"
      aria-setsize={list.list.length}
      data-testid="oppgavebehandling-documents-all-vedlegg-list"
      style={{ height: list.height, top: list.top }}
      $treeLineHeight={treeLineHeight}
    >
      {vedleggNodeList}
    </JournalfoerteDocumentsAttachments>
  );
};
