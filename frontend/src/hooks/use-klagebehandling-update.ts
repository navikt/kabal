import { useEffect } from 'react';
import { useUpdateKlagebehandlingMutation } from '../redux-api/oppgave';
import { IKlagebehandlingUpdate } from '../redux-api/oppgave-types';
import { useCanEdit } from './use-can-edit';

export const useKlagebehandlingUpdater = (klagebehandlingId: string, update: IKlagebehandlingUpdate | null) => {
  const [updateKlagebehandling] = useUpdateKlagebehandlingMutation();
  const canEdit = useCanEdit(klagebehandlingId);

  console.debug('UPDATE hook', update);

  useEffect(() => {
    if (!canEdit || update === null) {
      return;
    }

    const timeout = setTimeout(() => {
      console.debug(update.hjemler);

      return updateKlagebehandling(update);
    }, 500);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [canEdit, update, updateKlagebehandling]);
};

// export const useGetUpdate = (klagebehandlingId: string) => {
//   const canEdit = useCanEdit(klagebehandlingId);
//   const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);

//   return useMemo<IKlagebehandlingUpdate | null>(() => {
//     if (!canEdit) {
//       return null;
//     }

//     const update: IKlagebehandlingUpdate | null =
//       typeof klagebehandling === 'undefined'
//         ? null
//         : createOppdatering({ ...klagebehandling, klagebehandlingId: klagebehandling.id });
//     return isEqual(update, klagebehandling) ? null : update;
//   }, [klagebehandling, canEdit]);
// };

// export const useIsSaved = () => useGetUpdate() === null;

// export const isEqual = (a: IKlagebehandlingUpdate | undefined, b: IKlagebehandlingUpdate | undefined): boolean => {
//   if (a === b) {
//     return true;
//   }

//   if (typeof a === 'undefined' || typeof b === 'undefined') {
//     return false;
//   }

//   return (
//     a.internVurdering === b.internVurdering &&
//     a.klagebehandlingId === b.klagebehandlingId &&
//     a.klagebehandlingVersjon === b.klagebehandlingVersjon &&
//     a.vedtak[0].grunn === b.vedtak[0].grunn &&
//     a.vedtak[0].utfall === b.vedtak[0].utfall &&
//     arrayEquals(a.vedtak[0].hjemler, b.vedtak[0].hjemler) &&
//     compareTilknyttedeDokumenter(a.tilknyttedeDokumenter, b.tilknyttedeDokumenter)
//   );
// };

// const compareTilknyttedeDokumenter = (a: IDocumentReference[], b: IDocumentReference[]) =>
//   a.length === b.length && a.every((t1) => b.some((t2) => dokumentMatcher(t1, t2)));

// const createOppdatering = ({
//   internVurdering,
//   klagebehandlingId,
//   klagebehandlingVersjon,
//   tilknyttedeDokumenter,
//   vedtak,
// }: IKlagebehandlingUpdate): IKlagebehandlingUpdate => ({
//   internVurdering,
//   klagebehandlingId,
//   klagebehandlingVersjon,
//   tilknyttedeDokumenter,
//   vedtak,
// });
