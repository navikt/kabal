import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { JournalpostAddedEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import { type AvsenderMottaker, Journalposttype, type Sak } from '@app/types/arkiverte-documents';

export const handleJournalpostAddedEvent = (oppgaveId: string, userId: string) => (event: JournalpostAddedEvent) => {
  const { journalpostList, actor } = event;
  const count = journalpostList.length;

  if (actor.navIdent !== userId) {
    const distributedCount = journalpostList.filter((j) => j.journalposttype === Journalposttype.UTGAAENDE).length;

    if (distributedCount !== 0) {
      const mottakere = distributedCount === 1 ? '1 mottaker' : `${distributedCount} mottakere`;

      toast.info(
        <InfoToast title="Dokument journalført og distribuert">
          Et dokument har blitt journalført og distribuert til {mottakere} av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    } else {
      toast.info(
        <InfoToast title="Dokument journalført">
          Et dokument har blitt journalført av {formatEmployeeName(actor)}.
        </InfoToast>,
      );
    }
  }

  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (archiveResponse) => {
      if (archiveResponse === undefined) {
        if (count === 0) {
          return archiveResponse;
        }

        const fromDate = journalpostList.reduce<string>(
          (prev, curr) => (prev.length === 0 || curr.datoOpprettet < prev ? curr.datoOpprettet : prev),
          '',
        );

        const toDate = journalpostList.reduce<string>(
          (prev, curr) => (prev.length === 0 || curr.datoOpprettet > prev ? curr.datoOpprettet : prev),
          '',
        );

        const avsenderMottakerList = journalpostList.reduce<AvsenderMottaker[]>(
          (list, { avsenderMottaker }) =>
            avsenderMottaker === null || list.some((a) => a.id === avsenderMottaker.id)
              ? list
              : [...list, avsenderMottaker],
          [],
        );

        const journalposttypeList = journalpostList.reduce<Journalposttype[]>(
          (list, { journalposttype }) =>
            journalposttype === null || list.includes(journalposttype) ? list : [...list, journalposttype],
          [],
        );

        const sakList = journalpostList.reduce<Sak[]>(
          (list, { sak }) => (sak === null || list.some((s) => isSakEqual(s, sak)) ? list : [...list, sak]),
          [],
        );

        const temaIdList = journalpostList.reduce<string[]>(
          (list, { tema }) => (tema === null || list.includes(tema) ? list : [...list, tema]),
          [],
        );

        return {
          dokumenter: journalpostList,
          antall: count,
          totaltAntall: count,
          avsenderMottakerList,
          fromDate,
          toDate,
          journalposttypeList,
          pageReference: null,
          sakList,
          temaIdList,
        };
      }

      const avsenderMottakerList = [...archiveResponse.avsenderMottakerList];
      const sakList = [...archiveResponse.sakList];
      const temaIdList = [...archiveResponse.temaIdList];
      const journalposttypeList = [...archiveResponse.journalposttypeList];
      let dokumenter = [...archiveResponse.dokumenter];

      let { fromDate, toDate } = archiveResponse;

      for (const journalpost of journalpostList) {
        const { avsenderMottaker, sak, tema, datoOpprettet, journalposttype } = journalpost;

        if (fromDate === null || datoOpprettet < fromDate) {
          fromDate = datoOpprettet;
        }

        if (toDate === null || datoOpprettet > toDate) {
          toDate = datoOpprettet;
        }

        if (tema !== null && !temaIdList.includes(tema)) {
          temaIdList.push(tema);
        }

        if (avsenderMottaker !== null && !avsenderMottakerList.some(({ id }) => avsenderMottaker.id === id)) {
          avsenderMottakerList.push(avsenderMottaker);
        }

        if (sak !== null && !sakList.some((s) => isSakEqual(s, sak))) {
          sakList.push(sak);
        }

        if (journalposttype !== null && !journalposttypeList.includes(journalposttype)) {
          journalposttypeList.push(journalposttype);
        }

        if (!archiveResponse.dokumenter.some(({ journalpostId }) => journalpostId === journalpost.journalpostId)) {
          dokumenter = [journalpost, ...dokumenter];
        }
      }

      return {
        antall: archiveResponse.antall + count,
        totaltAntall: archiveResponse.totaltAntall + count,
        pageReference: archiveResponse.pageReference,
        dokumenter,
        avsenderMottakerList,
        journalposttypeList,
        sakList,
        temaIdList,
        fromDate,
        toDate,
      };
    }),
  );
};

const isSakEqual = (a: Sak, b: Sak) =>
  a.fagsakId === b.fagsakId && a.fagsaksystem === b.fagsaksystem && a.datoOpprettet === b.datoOpprettet;
