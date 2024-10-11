import type { VedleggListRenderData } from '@app/components/documents/journalfoerte-documents/calculate';
import { ROW_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { AttachmentListItem } from '@app/components/documents/journalfoerte-documents/document/attachments/attachment-list';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { JournalfoerteDocumentsAttachments } from '@app/components/documents/styled-components/attachment-list';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

interface Props {
  list: VedleggListRenderData;
  minTop: number;
  maxTop: number;
  dokument: IArkivertDocument;
  isSelected: (document: IJournalfoertDokumentId) => boolean;
  showLogiskeVedleggIdList: string[];
  setShowLogiskeVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

export const VedleggList = ({
  list,
  minTop,
  maxTop,
  dokument,
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

  const { journalpostId } = dokument;

  const vedleggNodeList: React.ReactNode[] = [];

  const lastIndex = length - 1;
  let treeLineHeight = ROW_HEIGHT / 2 + 1;

  for (const { globalTop, top, height, vedlegg, logiskeVedleggList, index } of list.list) {
    if (globalTop + height < minTop || globalTop > maxTop) {
      continue;
    }

    if (index !== lastIndex) {
      treeLineHeight += height;
    }

    const { dokumentInfoId, logiskeVedlegg } = vedlegg;
    const vedleggId = `${journalpostId}-${dokumentInfoId}`;
    const showVedleggList = showLogiskeVedleggIdList.includes(vedleggId);

    vedleggNodeList.push(
      <AttachmentListItem
        key={`vedlegg_${vedleggId}`}
        journalpostId={journalpostId}
        vedlegg={vedlegg}
        isSelected={isSelected({ journalpostId, dokumentInfoId })}
        showVedlegg={showVedleggList}
        hasVedlegg={logiskeVedlegg.length !== 0}
        toggleShowVedlegg={() =>
          setShowLogiskeVedleggIdList((ids) =>
            ids.includes(vedleggId) ? ids.filter((id) => id !== vedleggId) : [...ids, vedleggId],
          )
        }
        style={{ top, height }}
        aria-rowindex={index}
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
      data-testid="oppgavebehandling-documents-all-vedlegg-list"
      aria-rowcount={list.list.length}
      style={{ height: list.height, top: list.top }}
      $treeLineHeight={treeLineHeight}
    >
      {vedleggNodeList}
    </JournalfoerteDocumentsAttachments>
  );
};
