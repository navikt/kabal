/* eslint-disable max-lines */
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { ENVIRONMENT } from '@app/environment';
import { formatIdNumber } from '@app/functions/format-id';
import { reduxStore } from '@app/redux/configure-store';
import { forlengetBehandlingstidApi } from '@app/redux-api/forlenget-behandlingstid';
import { kvalitetsvurderingV3Api } from '@app/redux-api/kaka-kvalitetsvurdering/v3';
import { getFullmektigBody, getFullmektigMessage } from '@app/redux-api/oppgaver/mutations/fullmektig-helpers';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import type {
  IFinishOppgavebehandlingParams,
  IFinishWithUpdateInGosys,
  ISetFeilregistrertParams,
  ISetFullmektigParams,
  ISetInnsendingshjemlerParams,
  ISetKlagerParams,
} from '@app/types/oppgavebehandling/params';
import type {
  IModifiedResponse,
  ISetFeilregistrertResponse,
  IVedtakFullfoertResponse,
} from '@app/types/oppgavebehandling/response';
import { format } from 'date-fns';
import { kvalitetsvurderingV1Api } from '../../kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../../kaka-kvalitetsvurdering/v2';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const finishOppgaveOnQueryStarted = async ({
  kvalitetsvurderingId: id,
  oppgaveId,
  queryFulfilled,
}: {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
  queryFulfilled: Promise<{ data: IVedtakFullfoertResponse }>;
}) => {
  const { data } = await queryFulfilled;
  update(oppgaveId, data);

  reduxStore.dispatch(
    oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
      draft.isAvsluttetAvSaksbehandler = true;
      draft.avsluttetAvSaksbehandlerDate = data.modified;

      return draft;
    }),
  );

  reduxStore.dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));

  if (id !== null) {
    reduxStore.dispatch(kvalitetsvurderingV3Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
    reduxStore.dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
    reduxStore.dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
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
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled }) =>
        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled }),
    }),
    finishOppgavebehandlingWithUpdateInGosys: builder.mutation<IVedtakFullfoertResponse, IFinishWithUpdateInGosys>({
      query: ({ oppgaveId, gosysOppgaveUpdate, ignoreGosysOppgave }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=false`,
        method: 'POST',
        body: { gosysOppgaveUpdate, ignoreGosysOppgave },
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled }) =>
        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled }),
    }),
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: getFullmektigBody(fullmektig),
      }),
      onQueryStarted: async ({ oppgaveId, fullmektig }, { queryFulfilled, dispatch }) => {
        const undo = update(oppgaveId, { prosessfullmektig: fullmektig });

        const forlengetBehandlingstidPatchResult = dispatch(
          forlengetBehandlingstidApi.util.updateQueryData('getOrCreate', oppgaveId, (draft) => {
            draft.fullmektigFritekst = fullmektig?.name ?? null;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);

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
      onQueryStarted: async ({ oppgaveId, klager }, { queryFulfilled }) => {
        const undo = update(oppgaveId, { klager });

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);
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
      onQueryStarted: async ({ oppgaveId, hjemmelIdList }, { queryFulfilled }) => {
        const undo = update(oppgaveId, { hjemmelIdList });

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);
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
        update(oppgaveId, data);
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
      onQueryStarted: async (oppgaveId, { queryFulfilled }) => {
        const undo = update(oppgaveId, {
          isAvsluttetAvSaksbehandler: true,
          avsluttetAvSaksbehandlerDate: format(new Date(), ISO_FORMAT),
        });

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
      onQueryStarted: async (oppgaveId, { queryFulfilled }) => {
        const undo = update(oppgaveId, {
          isAvsluttetAvSaksbehandler: true,
          avsluttetAvSaksbehandlerDate: format(new Date(), ISO_FORMAT),
        });

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

const update = (oppgaveId: string, upd: Partial<IOppgavebehandling>) => {
  const patchResult = reduxStore.dispatch(
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
