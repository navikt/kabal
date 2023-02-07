import { KABAL_API_BASE_PATH, KABAL_BEHANDLINGER_BASE_PATH } from '../../redux-api/common';
import { DocumentTypeEnum, IShownDocument } from './types';

export const getDocumentUrl = (oppgaveId: string, document: IShownDocument) => {
  switch (document.type) {
    case DocumentTypeEnum.ARCHIVED: {
      const { dokumentInfoId, journalpostId } = document;

      return `${KABAL_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;
    }
    case DocumentTypeEnum.SMART:
    case DocumentTypeEnum.FILE:
      return `${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/${document.documentId}/pdf`;
  }
};
