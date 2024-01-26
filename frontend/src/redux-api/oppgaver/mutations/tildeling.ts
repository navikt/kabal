import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import {
  FradelSaksbehandlerParams,
  IFradelingResponse,
  ITildelingResponse,
  TildelSaksbehandlerParams,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const tildelMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    tildelSaksbehandler: builder.mutation<ITildelingResponse, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, employee }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/saksbehandler`,
        method: 'PUT',
        body: { navIdent: employee.navIdent },
      }),
      onQueryStarted: async ({ oppgaveId, employee }, { dispatch, queryFulfilled }) => {
        const optimisticBehandling = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.saksbehandler = employee;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;

          oppgaverApi.util.invalidateTags(Object.values(OppgaveListTagTypes));

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: data.saksbehandler,
            })),
          );
          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.saksbehandler = employee;
                draft.modified = data.modified;
              }
            }),
          );
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.tildeltSaksbehandlerident = employee.navIdent;
            }),
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: data.saksbehandler,
            })),
          );
        } catch (e) {
          optimisticBehandling.undo();

          const message = 'Kunne ikke tildele oppgave.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    fradelSaksbehandler: builder.mutation<IFradelingResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fradel`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const { oppgaveId } = params;
        const hjemmelIdList = 'hjemmelIdList' in params ? params.hjemmelIdList : null;

        const optimisticBehandling = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.saksbehandler = null;

              if (hjemmelIdList !== null) {
                draft.hjemmelIdList = hjemmelIdList;
              }
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;

          oppgaverApi.util.invalidateTags(Object.values(OppgaveListTagTypes));

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: null,
            })),
          );
          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.saksbehandler = null;
                draft.modified = data.modified;
                draft.hjemmelIdList = data.hjemmelIdList;
              }
            }),
          );
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.tildeltSaksbehandlerident = null;
              draft.hjemmelIdList = data.hjemmelIdList;
            }),
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: null,
            })),
          );
        } catch (e) {
          optimisticBehandling.undo();

          const message = 'Kunne ikke fradele oppgave.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
  }),
});

export const { useTildelSaksbehandlerMutation, useFradelSaksbehandlerMutation } = tildelMutationSlice;
