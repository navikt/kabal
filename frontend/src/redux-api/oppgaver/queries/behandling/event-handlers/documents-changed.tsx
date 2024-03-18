import { Tag } from '@navikt/ds-react';
import React from 'react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentsChangedEvent } from '@app/redux-api/server-sent-events/types';
import { DISTRIBUTION_TYPE_NAMES, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

export const handleDocumentsChangedEvent = (oppgaveId: string, userId: string) => (event: DocumentsChangedEvent) => {
  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
      draft.map((document) => {
        const update = event.documents.find((d) => d.id === document.id);

        if (update === undefined) {
          return document;
        }

        if (event.actor.navIdent !== userId) {
          handleToast(document, update, event.actor, draft);
        }

        if (document.type === DocumentTypeEnum.JOURNALFOERT) {
          return {
            ...document,
            parentId: update.parentId ?? document.parentId,
            dokumentTypeId: update.dokumentTypeId,
            tittel: update.tittel,
            isMarkertAvsluttet: update.isMarkertAvsluttet,
          };
        }

        return {
          ...document,
          parentId: update.parentId,
          dokumentTypeId: update.dokumentTypeId,
          tittel: update.tittel,
          isMarkertAvsluttet: update.isMarkertAvsluttet,
        };
      }),
    ),
  );
};

type Update = DocumentsChangedEvent['documents'][0];
type Actor = DocumentsChangedEvent['actor'];

const handleToast = (document: IMainDocument, update: Update, actor: Actor, draft: IMainDocument[]) => {
  if (update.isMarkertAvsluttet && !document.isMarkertAvsluttet && document.parentId === null) {
    const vedleggCount = draft.filter((d) => d.parentId === document.id).length;

    if (vedleggCount === 0) {
      toast.info(
        <InfoToast title="Dokument satt til journalføring">
          «{document.tittel}» har blitt satt til journalføring av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    } else {
      toast.info(
        <InfoToast title="Dokument satt til journalføring">
          «{document.tittel}» med {vedleggCount} vedlegg har blitt satt til journalføring av {formatEmployeeName(actor)}
          .
        </InfoToast>,
      );
    }
  }

  if (document.parentId === null && update.parentId !== null) {
    const newParent = draft.find((d) => d.id === update.parentId)?.tittel ?? update.parentId;

    toast.info(
      <InfoToast title="Dokument gjort om til vedlegg">
        «{document.tittel}» har blitt gjort til vedlegg for «{newParent}» av {formatEmployeeName(actor)}.
      </InfoToast>,
    );
  } else if (document.parentId !== null && update.parentId === null) {
    const oldParent = draft.find((d) => d.id === document.parentId)?.tittel ?? document.parentId;

    toast.info(
      <InfoToast title="Dokument gjort om til hoveddokument">
        «{document.tittel}» har blitt gjort til hoveddokument for «{oldParent}» av {formatEmployeeName(actor)}.
      </InfoToast>,
    );
  } else if (document.parentId !== update.parentId) {
    const oldParent = draft.find((d) => d.id === document.parentId)?.tittel ?? document.parentId;
    const newParent = draft.find((d) => d.id === update.parentId)?.tittel ?? update.parentId;

    toast.info(
      <InfoToast title="Vedlegg flyttet">
        Vedlegg «{document.tittel}» har blitt flyttet fra «{oldParent}» til «{newParent}» av {formatEmployeeName(actor)}
        .
      </InfoToast>,
    );
  }

  if (document.dokumentTypeId !== update.dokumentTypeId) {
    const from = (
      <Tag size="xsmall" variant="info">
        {DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId]}
      </Tag>
    );

    const to = (
      <Tag size="xsmall" variant="info">
        {DISTRIBUTION_TYPE_NAMES[update.dokumentTypeId]}
      </Tag>
    );

    toast.info(
      <InfoToast title="Dokumenttype endret">
        «{document.tittel}» har blitt endret fra {from} til {to} endret av {formatEmployeeName(actor)}.
      </InfoToast>,
    );
  }

  if (document.tittel !== update.tittel) {
    toast.info(
      <InfoToast title="Dokumentnavn endret">
        «{document.tittel}» har blitt omdøpt til «{update.tittel}» av {formatEmployeeName(actor)}.
      </InfoToast>,
    );
  }
};
