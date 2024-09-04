import { Tag } from '@navikt/ds-react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import { SmartDocumentLanguageEvent } from '@app/redux-api/server-sent-events/types';
import { LANGUAGE_NAMES } from '@app/types/texts/language';

export const handleSmartDocumentLanguageChangedEvent =
  (oppgaveId: string, userId: string) => (event: SmartDocumentLanguageEvent) => {
    reduxStore.dispatch(
      documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
        draft.map((document) => {
          if (!document.isSmartDokument || document.id !== event.id) {
            return document;
          }

          if (event.actor.navIdent !== userId) {
            const from = (
              <Tag variant="info" size="xsmall">
                {LANGUAGE_NAMES[document.language]}
              </Tag>
            );

            const to = (
              <Tag variant="info" size="xsmall">
                {LANGUAGE_NAMES[event.language]}
              </Tag>
            );

            toast.info(
              <InfoToast title="Dokument satt til journalføring">
                «{document.tittel}» har blitt endret fra {from} til {to} av {formatEmployeeName(event.actor)}.
              </InfoToast>,
            );
          }

          return { ...document, language: event.language };
        }),
      ),
    );
  };
