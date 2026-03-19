import { Tag } from '@navikt/ds-react';
import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { reduxStore } from '@/redux/configure-store';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { DocumentsRemovedEvent } from '@/redux-api/server-sent-events/types';
import type { INavEmployee } from '@/types/bruker';
import {
  DISTRIBUTION_TYPE_NAMES,
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IDocument,
  type IParentDocument,
} from '@/types/documents/documents';

export const handleDocumentsRemovedEvent = (oppgaveId: string, userId: string) => (event: DocumentsRemovedEvent) => {
  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (documents) => {
      if (documents === undefined) {
        return documents;
      }

      if (event.actor.navIdent === userId) {
        return documents.filter((d) => !event.idList.includes(d.id));
      }

      const removedParentDocuments: IParentDocument[] = [];
      const removedVedlegg: IDocument[] = [];

      const filteredList: IDocument[] = [];

      for (const d of documents) {
        if (event.idList.includes(d.id)) {
          if (isParentDocument(d)) {
            removedParentDocuments.push(d);
          } else {
            removedVedlegg.push(d);
          }
        } else {
          filteredList.push(d);
        }
      }

      handleToast(event.actor, removedParentDocuments, removedVedlegg, documents);

      return filteredList;
    }),
  );
};

const handleToast = (
  actor: INavEmployee,
  removedParentDocuments: IParentDocument[],
  removedVedlegg: IDocument[],
  documents: IDocument[],
) => {
  if (removedParentDocuments.length === 0) {
    const vedleggCount = removedVedlegg.length;

    const tag = (
      <Tag data-color="info" size="xsmall" variant="outline">
        Vedlegg
      </Tag>
    );

    if (vedleggCount === 1) {
      const [v] = removedVedlegg;

      if (v === undefined) {
        return;
      }

      const action = ACTION[v.type];

      toast.info(
        <InfoToast title={`Vedlegg ${action}`}>
          «{v.tittel}» {tag} har blitt {action} av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    } else {
      toast.info(
        <InfoToast title="Vedlegg slettet">
          {vedleggCount} {tag} har blitt slettet av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    }
  } else {
    for (const d of removedParentDocuments) {
      const vedleggCount = documents.filter((doc) => doc.parentId === d.id).length;

      const type = DOCUMENT_TYPE_NAMES[d.type];
      const distType = (
        <Tag data-color="info" size="xsmall" variant="outline">
          {DISTRIBUTION_TYPE_NAMES[d.dokumentTypeId]}
        </Tag>
      );

      if (vedleggCount === 0) {
        const action = ACTION[d.type];

        toast.info(
          <InfoToast title={`Dokument ${action}`}>
            {type} «{d.tittel}» {distType} har blitt {action} av {formatEmployeeName(actor)}.
          </InfoToast>,
        );
      } else {
        const tag = (
          <Tag data-color="info" size="xsmall" variant="outline">
            Vedlegg
          </Tag>
        );

        toast.info(
          <InfoToast title="Dokument og vedlegg slettet">
            {type} «{d.tittel}» {distType} og {vedleggCount} {tag} har blitt slettet av {formatEmployeeName(actor)}.
          </InfoToast>,
        );
      }
    }
  }
};

const isParentDocument = (document: IDocument): document is IParentDocument => document.parentId === null;

const ACTION: Record<IDocument['type'], string> = {
  [DocumentTypeEnum.JOURNALFOERT]: 'fjernet',
  [DocumentTypeEnum.UPLOADED]: 'slettet',
  [DocumentTypeEnum.SMART]: 'slettet',
};
