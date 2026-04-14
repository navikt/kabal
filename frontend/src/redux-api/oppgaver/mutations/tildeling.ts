import { format } from 'date-fns';
import { ISO_DATETIME_FORMAT } from '@/components/date-picker/constants';
import { ENVIRONMENT } from '@/environment';
import {
  BEHANDLINGSDIALOG_TAG_TYPES,
  OPPGAVE_LIST_TAG_TYPES,
  OPPGAVELIST_TAG_TYPES,
  OppgaveData,
  OppgaveTagTypes,
  oppgaverApi,
} from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import { user } from '@/static-data/static-data';
import { HistoryEventTypes, type ITildelingEvent } from '@/types/oppgavebehandling/response';
import {
  FradelReason,
  type FradelSaksbehandlerParams,
  type IFradelingResponse,
  type ITildelingResponse,
  type TildelSaksbehandlerParams,
} from '@/types/oppgaver';

const tildelMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
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
              draft.tildeltTimestamp = format(new Date(), ISO_DATETIME_FORMAT);
            }),
          );
        } catch {
          optimisticBehandling.undo();
        }
      },
      invalidatesTags: (_, __, { oppgaveId }) => [
        ...OPPGAVE_LIST_TAG_TYPES,
        ...BEHANDLINGSDIALOG_TAG_TYPES.map((type) => ({ type, id: oppgaveId })),
      ],
    }),
    fradelSaksbehandler: builder.mutation<IFradelingResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fradel`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const { oppgaveId } = params;
        const isFeilHjemmel = params.reasonId === FradelReason.FEIL_HJEMMEL;
        const userData = await user;

        const optimisticFradelingReason = dispatch(
          behandlingerQuerySlice.util.updateQueryData(
            'getFradelingReason',
            oppgaveId,
            (draft) =>
              ({
                previous: {
                  actor: draft?.actor ?? null,
                  event: draft?.event ?? {
                    fradelingReasonId: null,
                    hjemmelIdList: [],
                    saksbehandler: null,
                  },
                  timestamp: draft?.timestamp ?? format(new Date(), ISO_DATETIME_FORMAT),
                  type: HistoryEventTypes.TILDELING,
                },
                timestamp: format(new Date(), ISO_DATETIME_FORMAT),
                type: HistoryEventTypes.TILDELING,
                actor: {
                  navIdent: userData.navIdent,
                  navn: userData.navn,
                },
                event: isFeilHjemmel
                  ? {
                      saksbehandler: null,
                      fradelingReasonId: params.reasonId,
                      hjemmelIdList: params.hjemmelIdList,
                    }
                  : {
                      saksbehandler: null,
                      fradelingReasonId: params.reasonId,
                      hjemmelIdList: [],
                    },
              }) satisfies ITildelingEvent,
          ),
        );
        try {
          await queryFulfilled;

          dispatch(oppgaverApi.util.invalidateTags(OPPGAVELIST_TAG_TYPES));
          dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));
          dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveData.OPPGAVE_DATA, id: oppgaveId }]));

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: null,
            })),
          );
        } catch {
          optimisticFradelingReason.undo();
        }
      },
    }),
  }),
});

export const { useTildelSaksbehandlerMutation, useFradelSaksbehandlerMutation } = tildelMutationSlice;
