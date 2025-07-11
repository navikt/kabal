import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { areJournalfoertDocumentsEqual } from '@app/domain/journalfoerte-documents';
import { reduxStore } from '@app/redux/configure-store';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { DocumentsAddedEvent } from '@app/redux-api/server-sent-events/types';
import type { INavEmployee } from '@app/types/bruker';
import {
  DISTRIBUTION_TYPE_NAMES,
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IDocument,
} from '@app/types/documents/documents';
import { Tag } from '@navikt/ds-react';

export const handleDocumentsAddedEvent = (oppgaveId: string, userId: string) => (event: DocumentsAddedEvent) => {
  const { actor, documents } = event;

  if (actor.navIdent !== userId) {
    handleToast(documents, actor);
  }

  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
      if (draft === undefined) {
        return event.documents;
      }

      for (const document of event.documents) {
        if (!draft.some((d) => d.id === document.id || areJournalfoertDocumentsEqual(d, document))) {
          draft.push(document);
        }
      }

      return draft.sort((a, b) => {
        if (a.type === DocumentTypeEnum.JOURNALFOERT) {
          if (b.type === DocumentTypeEnum.JOURNALFOERT) {
            return b.journalfoertDokumentReference.sortKey.localeCompare(a.journalfoertDokumentReference.sortKey);
          }

          return 1;
        }

        if (b.type === DocumentTypeEnum.JOURNALFOERT) {
          return -1;
        }

        return b.created.localeCompare(a.created);
      });
    }),
  );
};

const handleToast = (documents: IDocument[], actor: INavEmployee) => {
  const count = documents.length;

  if (count === 0) {
    return;
  }

  if (count === 1) {
    const [document] = documents;

    if (document === undefined) {
      return;
    }

    const type = DOCUMENT_TYPE_NAMES[document.type];
    const action = ACTION[document.type];
    const distType = document.parentId === null ? DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId] : 'Vedlegg';
    const distTypeTag = (
      <Tag size="xsmall" variant="info">
        {distType}
      </Tag>
    );

    toast.info(
      <InfoToast title={`${type} ${action} som ${distType.toLowerCase()}`}>
        {type} «{document?.tittel}» har blitt {action} som {distTypeTag} av {formatEmployeeName(actor)}.
      </InfoToast>,
    );
  } else {
    const vedleggCount = documents.filter((d) => d.parentId !== null).length;

    if (vedleggCount === 0) {
      toast.info(
        <InfoToast title="Dokumenter lagt til">
          {count} dokumenter har blitt lagt til av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    } else if (vedleggCount === count) {
      toast.info(
        <InfoToast title="Vedlegg lagt til">
          {count} vedlegg har blitt lagt til av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    } else {
      const parentCount = count - vedleggCount;

      if (parentCount === 1) {
        const [parent] = documents.filter((d) => d.parentId === null);

        if (parent === undefined) {
          return;
        }

        toast.info(
          <InfoToast title="Dokumenter og vedlegg lagt til">
            «{parent.tittel}» og {vedleggCount} vedlegg har blitt lagt til av {formatEmployeeName(actor)}.
          </InfoToast>,
        );
      } else {
        const dokument = parentCount === 1 ? 'dokument' : 'dokumenter';
        toast.info(
          <InfoToast title="Dokumenter og vedlegg lagt til">
            {parentCount} {dokument} og {vedleggCount} vedlegg har blitt lagt til av {formatEmployeeName(actor)}.
          </InfoToast>,
        );
      }
    }
  }
};

const ACTION: Record<IDocument['type'], string> = {
  [DocumentTypeEnum.JOURNALFOERT]: 'lagt til',
  [DocumentTypeEnum.UPLOADED]: 'lastet opp',
  [DocumentTypeEnum.SMART]: 'opprettet',
};
