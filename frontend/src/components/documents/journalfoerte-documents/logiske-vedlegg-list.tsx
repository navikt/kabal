import { AddLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/add-logisk-vedlegg';
import type { LogiskeVedleggListRenderData } from '@app/components/documents/journalfoerte-documents/calculate';
import {
  LOGISK_VEDLEGG_HEIGHT,
  LOGISK_VEDLEGG_SPACE,
} from '@app/components/documents/journalfoerte-documents/contants';
import { EditableLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/editable';
import { LogiskeVedleggListItemStyle } from '@app/components/documents/styled-components/attachment-list';
import type { LogiskVedlegg } from '@app/types/arkiverte-documents';

interface Props {
  list: LogiskeVedleggListRenderData;
  minTop: number;
  maxTop: number;
  left?: number;
  hasVedlegg?: boolean;
  logiskeVedlegg: LogiskVedlegg[];
  temaId: string | null;
  dokumentInfoId: string;
}

export const LogiskeVedleggList = ({
  list,
  minTop,
  maxTop,
  left = 16,
  hasVedlegg = false,
  dokumentInfoId,
  logiskeVedlegg,
  temaId,
}: Props) => {
  if (list.globalTop + list.height < minTop || list.globalTop > maxTop) {
    return null;
  }

  const logiskeVedleggNodeList: React.ReactNode[] = [];
  const { length } = list.list;

  for (const { globalTop, top, height, logiskVedlegg, index } of list.list) {
    if (globalTop + height < minTop || globalTop > maxTop) {
      continue;
    }

    logiskeVedleggNodeList.push(
      <LogiskeVedleggListItemStyle
        key={`logisk-vedlegg_${logiskVedlegg.logiskVedleggId}`}
        style={{ top }}
        aria-rowindex={index}
        connected
      >
        <EditableLogiskVedlegg
          logiskVedlegg={logiskVedlegg}
          dokumentInfoId={dokumentInfoId}
          temaId={temaId}
          logiskeVedlegg={logiskeVedlegg}
          key="edit"
        />
      </LogiskeVedleggListItemStyle>,
    );
  }

  const addButtonTop = length * LOGISK_VEDLEGG_HEIGHT + length * LOGISK_VEDLEGG_SPACE;
  const addButtonGlobalTop = list.globalTop + addButtonTop;
  const shouldRenderAddButton = addButtonGlobalTop >= minTop && addButtonGlobalTop <= maxTop;

  return (
    // biome-ignore lint/a11y/useSemanticElements: Tree structure.
    <ul
      className="absolute right-0"
      data-list="logiske-vedlegg"
      style={{ height: list.height, top: list.top, left }}
      role="group"
    >
      {logiskeVedleggNodeList}
      {shouldRenderAddButton ? (
        <AddLogiskVedlegg
          hasVedlegg={hasVedlegg}
          index={length}
          top={addButtonTop}
          dokumentInfoId={dokumentInfoId}
          logiskeVedlegg={logiskeVedlegg}
          temaId={temaId}
        />
      ) : null}
    </ul>
  );
};
