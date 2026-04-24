/* eslint-disable max-lines */

import { format } from 'date-fns';
import { ISO_FORMAT } from '@/components/date-picker/constants';
import { toast } from '@/components/toast/store';
import { ENVIRONMENT } from '@/environment';
import { formatIdNumber } from '@/functions/format-id';
import { forlengetBehandlingstidApi } from '@/redux-api/forlenget-behandlingstid';
import { kvalitetsvurderingV1Api } from '@/redux-api/kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '@/redux-api/kaka-kvalitetsvurdering/v2';
import { kvalitetsvurderingV3Api } from '@/redux-api/kaka-kvalitetsvurdering/v3';
import { getFullmektigBody, getFullmektigMessage } from '@/redux-api/oppgaver/mutations/fullmektig-helpers';
import { OppgaveTagTypes, oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import type { Dispatch } from '@/redux-api/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import type {
  IFinishOppgavebehandlingParams,
  IFinishWithUpdateInGosys,
  ISetFeilregistrertParams,
  ISetFullmektigParams,
  ISetInnsendingshjemlerParams,
  ISetKlagerParams,
} from '@/types/oppgavebehandling/params';
import type {
  IModifiedResponse,
  ISetFeilregistrertResponse,
  IVedtakFullfoertResponse,
} from '@/types/oppgavebehandling/response';

const finishOppgaveOnQueryStarted = async ({
  kvalitetsvurderingId: id,
  oppgaveId,
  queryFulfilled,
  dispatch,
}: {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
  queryFulfilled: Promise<{ data: IVedtakFullfoertResponse }>;
  dispatch: Dispatch;
}) => {
  const { data } = await queryFulfilled;
  update(oppgaveId, data, dispatch);

  dispatch(
    oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
      draft.isAvsluttetAvSaksbehandler = true;
      draft.avsluttetAvSaksbehandlerDate = data.modified;

      return draft;
    }),
  );

  dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));

  if (id !== null) {
    dispatch(kvalitetsvurderingV3Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
    dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
    dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
  }
};

export const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishOppgavebehandlingParams>({
      query: ({ oppgaveId, nyBehandling }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=${nyBehandling}`,
        method: 'POST',
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled, dispatch }) =>
        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled, dispatch }),
    }),
    finishOppgavebehandlingWithUpdateInGosys: builder.mutation<IVedtakFullfoertResponse, IFinishWithUpdateInGosys>({
      query: ({ oppgaveId, gosysOppgaveUpdate, ignoreGosysOppgave }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=false`,
        method: 'POST',
        body: { gosysOppgaveUpdate, ignoreGosysOppgave },
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled, dispatch }) =>
        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled, dispatch }),
    }),
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: getFullmektigBody(fullmektig),
      }),
      onQueryStarted: async ({ oppgaveId, fullmektig }, { queryFulfilled, dispatch }) => {
        const undo = update(oppgaveId, { prosessfullmektig: fullmektig }, dispatch);

        const forlengetBehandlingstidPatchResult = dispatch(
          forlengetBehandlingstidApi.util.updateQueryData('getOrCreate', oppgaveId, (draft) => {
            draft.fullmektigFritekst = fullmektig?.name ?? null;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data, dispatch);

          toast.success(getFullmektigMessage(fullmektig));
        } catch {
          undo();
          forlengetBehandlingstidPatchResult.undo();
        }
      },
    }),
    updateKlager: builder.mutation<IModifiedResponse, ISetKlagerParams>({
      query: ({ oppgaveId, klager }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/klager`,
        method: 'PUT',
        body: { identifikator: klager?.identifikator ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, klager }, { queryFulfilled, dispatch }) => {
        const undo = update(oppgaveId, { klager }, dispatch);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data, dispatch);
          toast.success(`Klager endret til «${klager.name}» (${formatIdNumber(klager.identifikator)})`);
        } catch {
          undo();
        }
      },
    }),
    setInnsendingshjemler: builder.mutation<IModifiedResponse, ISetInnsendingshjemlerParams>({
      query: ({ oppgaveId, hjemmelIdList }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/innsendingshjemler`,
        method: 'PUT',
        body: { hjemmelIdList },
      }),
      onQueryStarted: async ({ oppgaveId, hjemmelIdList }, { queryFulfilled, dispatch }) => {
        const undo = update(oppgaveId, { hjemmelIdList }, dispatch);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data, dispatch);
          toast.success('Innsendingshjemler oppdatert');
        } catch {
          undo();
        }
      },
    }),
    setFeilregistrert: builder.mutation<ISetFeilregistrertResponse, ISetFeilregistrertParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/feilregistrer`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        update(oppgaveId, data, dispatch);
        dispatch(
          oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
            draft.feilregistrert = data.feilregistrering.registered;

            return draft;
          }),
        );
        toast.success('Oppgave feilregistrert');
      },
    }),
    newAnkebehandling: builder.mutation<void, string>({
      query: (oppgaveId) => ({ url: `/kabal-api/behandlinger/${oppgaveId}/nyankebehandlingka`, method: 'POST' }),
      onQueryStarted: async (oppgaveId, { queryFulfilled, dispatch }) => {
        const undo = update(
          oppgaveId,
          {
            isAvsluttetAvSaksbehandler: true,
            avsluttetAvSaksbehandlerDate: format(new Date(), ISO_FORMAT),
          },
          dispatch,
        );

        try {
          await queryFulfilled;
          toast.success('Ny ankebehandling opprettet');
        } catch {
          undo();
        }
      },
    }),
    newBehandlingFromTRBehandling: builder.mutation<void, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/nybehandlingfratrygderettbehandling`,
        method: 'POST',
      }),
      onQueryStarted: async (oppgaveId, { queryFulfilled, dispatch }) => {
        const undo = update(
          oppgaveId,
          {
            isAvsluttetAvSaksbehandler: true,
            avsluttetAvSaksbehandlerDate: format(new Date(), ISO_FORMAT),
          },
          dispatch,
        );

        try {
          await queryFulfilled;
          toast.success('Ny behandling opprettet');
        } catch {
          undo();
        }
      },
    }),
  }),
});

const update = (oppgaveId: string, upd: Partial<IOppgavebehandling>, dispatch: Dispatch) => {
  const patchResult = dispatch(
    behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) =>
      Object.assign(draft, upd),
    ),
  );

  return patchResult.undo;
};

export const {
  useFinishOppgavebehandlingMutation,
  useFinishOppgavebehandlingWithUpdateInGosysMutation,
  useUpdateFullmektigMutation,
  useUpdateKlagerMutation,
  useSetInnsendingshjemlerMutation,
  useSetFeilregistrertMutation,
  useNewAnkebehandlingMutation,
  useNewBehandlingFromTRBehandlingMutation,
} = behandlingerMutationSlice;
