import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import type { IncludedDocumentsChangedEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export const handleIncludedDocumentsAdded =
  (oppgaveId: string, userId: string) => (event: IncludedDocumentsChangedEvent) => {
    reduxStore.dispatch(
      behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
        for (const added of event.journalfoertDokumentReferenceSet) {
          if (!draft.tilknyttedeDokumenter.some((d) => match(d, added))) {
            draft.tilknyttedeDokumenter.push(added);
          }
        }

        return draft;
      }),
    );

    if (event.actor.navIdent !== userId) {
      const prefix =
        event.journalfoertDokumentReferenceSet.length === 1
          ? 'Dokument'
          : `${event.journalfoertDokumentReferenceSet.length} dokumenter`;

      toast.info(
        <InfoToast title="Inkluderte dokumenter endret">
          {prefix} ble inkludert av {formatEmployeeName(event.actor)}.
        </InfoToast>,
      );
    }
  };

export const handleIncludedDocumentsRemoved =
  (oppgaveId: string, userId: string) => (event: IncludedDocumentsChangedEvent) => {
    reduxStore.dispatch(
      behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
        const tilknyttedeDokumenter = draft.tilknyttedeDokumenter.filter((d) =>
          event.journalfoertDokumentReferenceSet.every((r) => !match(d, r)),
        );

        return { ...draft, tilknyttedeDokumenter };
      }),
    );

    if (event.actor.navIdent !== userId) {
      const prefix =
        event.journalfoertDokumentReferenceSet.length === 1
          ? 'Dokument'
          : `${event.journalfoertDokumentReferenceSet.length} dokumenter`;

      toast.info(
        <InfoToast title="Inkluderte dokumenter endret">
          {prefix} ble ekskludert av {formatEmployeeName(event.actor)}.
        </InfoToast>,
      );
    }
  };

const match = (a: IJournalfoertDokumentId, b: IJournalfoertDokumentId) =>
  a.journalpostId === b.journalpostId && a.dokumentInfoId === b.dokumentInfoId;
