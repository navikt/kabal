import { toast } from '../../../components/toast/store';
import { ToastType } from '../../../components/toast/types';
import { formatIdNumber } from '../../../functions/format-id';
import { reduxStore } from '../../../redux/configure-store';
import { IOppgavebehandling, ISakspart } from '../../../types/oppgavebehandling/oppgavebehandling';
import {
  IFinishOppgavebehandlingParams,
  IOppgavebehandlingHjemlerUpdateParams,
  ISetFullmektigParams,
} from '../../../types/oppgavebehandling/params';
import { IModifiedResponse, IVedtakFullfoertResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { kvalitetsvurderingV1Api } from '../../kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../../kaka-kvalitetsvurdering/v2';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishOppgavebehandlingParams>({
      query: ({ oppgaveId }) => ({ url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer`, method: 'POST' }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: async ({ oppgaveId, kvalitetsvurderingId: id }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        update(oppgaveId, [
          ['modified', data.modified],
          ['isAvsluttetAvSaksbehandler', data.isAvsluttetAvSaksbehandler],
        ]);
        dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));
        dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
        dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
      },
    }),

    updateInnsendingshjemler: builder.mutation<IModifiedResponse, IOppgavebehandlingHjemlerUpdateParams>({
      query: ({ oppgaveId, hjemler }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/innsendingshjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ oppgaveId, hjemler }, { queryFulfilled }) => {
        const undo = update(oppgaveId, [['hjemler', hjemler]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
          toast({
            type: ToastType.SUCCESS,
            message: hjemler.length === 0 ? 'Hjemler fjernet' : 'Hjemler endret',
          });
        } catch {
          toast({ type: ToastType.ERROR, message: 'Feil ved endring av hjemler' });
          undo();
        }
      },
    }),
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig: { person, virksomhet } }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: { identifikator: person?.foedselsnummer ?? virksomhet?.virksomhetsnummer ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, fullmektig }, { queryFulfilled }) => {
        const undo = update(oppgaveId, [['prosessfullmektig', fullmektig]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);

          toast({
            type: ToastType.SUCCESS,
            message:
              fullmektig.person === null && fullmektig.virksomhet === null
                ? 'Fullmektig fjernet'
                : `Fullmektig endret til ${formatIdNumber(
                    fullmektig.person?.foedselsnummer ?? fullmektig.virksomhet?.virksomhetsnummer
                  )}`,
          });
        } catch {
          toast({ type: ToastType.ERROR, message: 'Feil ved endring av fullmektig' });

          undo();
        }
      },
    }),
    searchFullmektig: builder.query<ISakspart, string>({
      query: (identifikator) => ({ url: `/kabal-api/searchfullmektig`, method: 'POST', body: { identifikator } }),
    }),
  }),
});

const update = <K extends keyof IOppgavebehandling>(oppgaveId: string, values: [K, IOppgavebehandling[K]][]) => {
  const patchResult = reduxStore.dispatch(
    behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
      values.forEach(([key, value]) => {
        draft[key] = value;
      });
    })
  );

  return patchResult.undo;
};

export const {
  useFinishOppgavebehandlingMutation,
  useUpdateInnsendingshjemlerMutation,
  useUpdateFullmektigMutation,
  useLazySearchFullmektigQuery,
} = behandlingerMutationSlice;
