import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { BaseEvent, IncludedDocumentsChangedEvent } from '@/redux-api/server-sent-events/types';
import type { IJournalfoertDokumentId } from '@/types/oppgave-common';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const handleIncludedDocumentsAdded =
  (userId: string, updateOppgavebehandling: UpdateFn<IOppgavebehandling>) => (event: IncludedDocumentsChangedEvent) => {
    updateOppgavebehandling((draft) => {
      for (const added of event.journalfoertDokumentReferenceSet) {
        if (!draft.tilknyttedeDokumenter.some((d) => match(d, added))) {
          draft.tilknyttedeDokumenter.push(added);
        }
      }

      return draft;
    });

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
  (userId: string, updateOppgavebehandling: UpdateFn<IOppgavebehandling>) => (event: IncludedDocumentsChangedEvent) => {
    updateOppgavebehandling((draft) => {
      const tilknyttedeDokumenter = draft.tilknyttedeDokumenter.filter((d) =>
        event.journalfoertDokumentReferenceSet.every((r) => !match(d, r)),
      );

      return { ...draft, tilknyttedeDokumenter };
    });

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

export const handleIncludedDocumentsCleared =
  (userId: string, updateOppgavebehandling: UpdateFn<IOppgavebehandling>) => (event: BaseEvent) => {
    updateOppgavebehandling((draft) => ({
      ...draft,
      tilknyttedeDokumenter: [],
    }));

    if (event.actor.navIdent !== userId) {
      toast.info(
        <InfoToast title="Inkluderte dokumenter endret">
          Alle inkluderte dokumenter ble ekskludert av {formatEmployeeName(event.actor)}. Ingen dokumenter er nå
          inkluderte.
        </InfoToast>,
      );
    }
  };

const match = (a: IJournalfoertDokumentId, b: IJournalfoertDokumentId) =>
  a.journalpostId === b.journalpostId && a.dokumentInfoId === b.dokumentInfoId;
