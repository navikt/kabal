import type { VedleggListRenderData } from '@app/components/documents/journalfoerte-documents/calculate';
import { ROW_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { AttachmentListItem } from '@app/components/documents/journalfoerte-documents/document/attachments/attachment-list';
import { isPathSelected } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { useShowLogiskeVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-logiske-vedlegg';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { VStack } from '@navikt/ds-react';

interface Props {
  list: VedleggListRenderData;
  minTop: number;
  maxTop: number;
  dokument: IArkivertDocument;
  documentIndex: number;
}

export const VedleggList = ({ list, minTop, maxTop, dokument, documentIndex }: Props) => {
  const { value: showLogiskeVedlegg, setValue: setShowLogiskeVedleggIdList } = useShowLogiskeVedlegg();

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
    const showVedleggList = showLogiskeVedlegg.includes(vedleggId);

    vedleggNodeList.push(
      <AttachmentListItem
        key={`vedlegg_${vedleggId}`}
        role="treeitem"
        aria-selected={isPathSelected(documentIndex, index)}
        aria-level={2}
        journalpostId={journalpostId}
        journalpoststatus={journalstatus}
        vedlegg={vedlegg}
        showVedlegg={showVedleggList}
        hasVedlegg={logiskeVedlegg.length > 0}
        documentIndex={documentIndex}
        index={index}
        toggleShowVedlegg={() =>
          setShowLogiskeVedleggIdList((ids = []) =>
            ids.includes(vedleggId) ? ids.filter((id) => id !== vedleggId) : [...ids, vedleggId],
          )
        }
        style={{ top, height }}
        aria-posinset={index}
        className="pr-05 pl-4"
      >
        {showVedleggList ? (
          <LogiskeVedleggList
            list={logiskeVedleggList}
            minTop={minTop}
            maxTop={maxTop}
            left={65}
            dokumentInfoId={dokumentInfoId}
            logiskeVedlegg={logiskeVedlegg}
            temaId={dokument.temaId}
          />
        ) : null}
      </AttachmentListItem>,
    );
  }

  return (
    <VStack
      as="ul"
      role="group"
      aria-setsize={list.list.length}
      data-testid="oppgavebehandling-documents-all-vedlegg-list"
      position="absolute"
      right="0"
      left="0"
      style={{
        height: list.height,
        top: list.top,
        gridColumnEnd: 'action-end',
        gridColumnStart: 'title-start',
        [TREE_HEIGHT_VAR]: `${treeLineHeight}px`,
      }}
      className="left-[51px] before:absolute before:top-0 before:left-0 before:h-(--tree-height) before:border-l before:border-l-ax-border-neutral-subtle"
    >
      {vedleggNodeList}
    </VStack>
  );
};

const TREE_HEIGHT_VAR: string = '--tree-height';
