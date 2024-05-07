import {
  EXPANDED_HEIGHT,
  LOGISKE_VEDLEGG_OFFSET,
  LOGISK_VEDLEGG_HEIGHT,
  LOGISK_VEDLEGG_SPACE,
  ROW_HEIGHT,
} from '@app/components/documents/journalfoerte-documents/contants';
import { IArkivertDocument, IArkivertDocumentVedlegg, LogiskVedlegg } from '@app/types/arkiverte-documents';

interface Position {
  height: number;
  top: number;
  globalTop: number;
}

interface Index {
  index: number;
}

interface LogiskVedleggRenderData extends Position, Index {
  logiskVedlegg: LogiskVedlegg;
}

interface VedleggRenderData extends Position, Index {
  vedlegg: IArkivertDocumentVedlegg;
  logiskeVedleggList: LogiskeVedleggListRenderData;
}

interface DokumentRenderData extends Position, Index {
  dokument: IArkivertDocument;
  logiskeVedleggList: LogiskeVedleggListRenderData;
  vedleggList: VedleggListRenderData;
  showMetadata: boolean;
  showVedlegg: boolean;
}

interface DokumentListRenderData extends Position {
  list: DokumentRenderData[];
}

export const calculateDokumentPositions = (
  dokumenter: IArkivertDocument[],
  metadataIdList: string[],
  showVedleggIdList: string[],
  showLogiskeVedleggIdList: string[],
): DokumentListRenderData => {
  const dokumenterLength = dokumenter.length;

  const list = new Array<DokumentRenderData>(dokumenterLength);

  let listHeight = 0;

  for (let index = 0; index < dokumenterLength; index++) {
    const dokument = dokumenter[index]!;
    const showMetadata = metadataIdList.includes(dokument.journalpostId);
    const showVedlegg = showVedleggIdList.includes(dokument.journalpostId);
    const dokumentHeight = showMetadata ? ROW_HEIGHT + EXPANDED_HEIGHT : ROW_HEIGHT;

    const logiskeVedleggList = calculateLogiskeVedlegg(
      dokument.logiskeVedlegg,
      dokumentHeight + LOGISKE_VEDLEGG_OFFSET,
      listHeight + dokumentHeight + LOGISKE_VEDLEGG_OFFSET,
    );

    const vedleggList = calculateVedlegg(
      dokument.vedlegg,
      logiskeVedleggList.top + logiskeVedleggList.height,
      listHeight + logiskeVedleggList.top + logiskeVedleggList.height,
      showLogiskeVedleggIdList,
      dokument.journalpostId,
    );

    const height = showVedlegg ? vedleggList.top + vedleggList.height : dokumentHeight;

    list[index] = {
      dokument,
      top: listHeight,
      globalTop: listHeight,
      logiskeVedleggList,
      vedleggList,
      height,
      showMetadata,
      showVedlegg,
      index,
    };

    listHeight += height;
  }

  return { list, globalTop: 0, top: 0, height: listHeight };
};

export interface LogiskeVedleggListRenderData extends Position {
  list: LogiskVedleggRenderData[];
}

const calculateLogiskeVedlegg = (
  logiskeVedlegg: LogiskVedlegg[],
  listTop: number,
  listGlobalTop: number,
): LogiskeVedleggListRenderData => {
  const list = logiskeVedlegg.map<LogiskVedleggRenderData>((logiskVedlegg, index) => {
    const top = index * (LOGISK_VEDLEGG_HEIGHT + LOGISK_VEDLEGG_SPACE);
    const globalTop = top + listGlobalTop;

    return { logiskVedlegg, top, globalTop, height: LOGISK_VEDLEGG_HEIGHT, index };
  });

  const height = logiskeVedlegg.length * (LOGISK_VEDLEGG_HEIGHT + LOGISK_VEDLEGG_SPACE) + LOGISK_VEDLEGG_HEIGHT; // Add one row for add button.

  return { list, height, top: listTop, globalTop: listGlobalTop };
};

export interface VedleggListRenderData extends Position {
  list: VedleggRenderData[];
}

const calculateVedlegg = (
  vedlegg: IArkivertDocumentVedlegg[],
  listTop: number,
  listGlobalTop: number,
  showLogiskeVedleggIdList: string[],
  journalpostId: string,
): VedleggListRenderData => {
  let listHeight = 0;

  const list = vedlegg.map<VedleggRenderData>((v, index) => {
    const logiskeVedleggList = calculateLogiskeVedlegg(
      v.logiskeVedlegg,
      ROW_HEIGHT,
      ROW_HEIGHT + listGlobalTop + listHeight,
    );

    const top = listHeight;
    const globalTop = top + listGlobalTop;
    const height = showLogiskeVedleggIdList.includes(`${journalpostId}-${v.dokumentInfoId}`)
      ? logiskeVedleggList.height + ROW_HEIGHT
      : ROW_HEIGHT;

    listHeight += height;

    return { globalTop, height, top, vedlegg: v, logiskeVedleggList, index };
  });

  return { list, height: listHeight, top: listTop, globalTop: listGlobalTop };
};
