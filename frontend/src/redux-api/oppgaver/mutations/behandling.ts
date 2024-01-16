import { format } from 'date-fns';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { formatIdNumber } from '@app/functions/format-id';
import { reduxStore } from '@app/redux/configure-store';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { IPart } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  IFinishOppgavebehandlingParams,
  IOppgavebehandlingBaseParams,
  ISetFeilregistrertParams,
  ISetFullmektigParams,
  ISetKlagerParams,
} from '@app/types/oppgavebehandling/params';
import {
  IModifiedResponse,
  ISetFeilregistrertResponse,
  IVedtakFullfoertResponse,
} from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { kvalitetsvurderingV1Api } from '../../kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../../kaka-kvalitetsvurdering/v2';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishOppgavebehandlingParams>({
      query: ({ oppgaveId, nyBehandling }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=${nyBehandling}`,
        method: 'POST',
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: async ({ oppgaveId, kvalitetsvurderingId: id }, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.isAvsluttetAvSaksbehandler = true;
              draft.avsluttetAvSaksbehandlerDate = data.modified;

              return draft;
            }),
          );

          dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));

          if (id !== null) {
            dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
            dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
          }
        } catch (e) {
          const message = 'Kunne ikke fullføre behandling.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: { identifikator: fullmektig?.id ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, fullmektig }, { queryFulfilled }) => {
        const undo = update(oppgaveId, { prosessfullmektig: fullmektig });

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);

          toast.success(
            fullmektig === null
              ? 'Fullmektig fjernet'
              : `Fullmektig satt til ${fullmektig.name} (${formatIdNumber(fullmektig.id)})`,
          );
        } catch (e) {
          undo();
          const message = 'Kunne ikke endre fullmektig.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    updateKlager: builder.mutation<IModifiedResponse, ISetKlagerParams>({
      query: ({ oppgaveId, klager }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/klager`,
        method: 'PUT',
        body: { identifikator: klager?.id ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, klager }, { queryFulfilled }) => {
        const undo = update(oppgaveId, { klager });

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);
          toast.success(`Klager endret til ${klager.name} (${formatIdNumber(klager.id)})`);
        } catch (e) {
          undo();
          const message = 'Kunne ikke endre fullmektig.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
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
        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, data);
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.feilregistrert = data.feilregistrering.registered;

              return draft;
            }),
          );
          toast.success('Oppgave feilregistrert');
        } catch (e) {
          const message = 'Kunne ikke feilregistrere.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    searchPart: builder.query<IPart, string>({
      query: (identifikator) => ({ url: `/kabal-api/searchpart`, method: 'POST', body: { identifikator } }),
    }),
    newAnkebehandling: builder.mutation<void, IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => ({ url: `/kabal-api/behandlinger/${oppgaveId}/nyankebehandlingka`, method: 'POST' }),
      onQueryStarted: async ({ oppgaveId }, { queryFulfilled }) => {
        const undo = update(oppgaveId, {
          isAvsluttetAvSaksbehandler: true,
          avsluttetAvSaksbehandlerDate: format(new Date(), ISO_FORMAT),
        });

        try {
          await queryFulfilled;
          toast.success('Ny ankebehandling opprettet');
        } catch (e) {
          undo();

          const message = 'Feil ved oppretting av ny ankebehandling.';

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
  useUpdateFullmektigMutation,
  useUpdateKlagerMutation,
  useSetFeilregistrertMutation,
  useLazySearchPartQuery,
  useNewAnkebehandlingMutation,
} = behandlingerMutationSlice;
