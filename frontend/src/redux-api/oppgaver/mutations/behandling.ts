/* eslint-disable max-lines */
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isReduxValidationResponse } from '@app/functions/error-type-guard';
import { formatIdNumber } from '@app/functions/format-id';
import { forlengetBehandlingstidApi } from '@app/redux-api/forlenget-behandlingstid';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { reduxStore } from '@app/redux/configure-store';
import { isApiRejectionError } from '@app/types/errors';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import type {
  IFinishOppgavebehandlingParams,
  IFinishWithUpdateInGosys,
  IOppgavebehandlingBaseParams,
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
import { IS_LOCALHOST } from '../../common';
import { kvalitetsvurderingV1Api } from '../../kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../../kaka-kvalitetsvurdering/v2';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const finishOppgaveOnQueryStarted = async ({
  kvalitetsvurderingId: id,
  oppgaveId,
  queryFulfilled,
  catchFn,
}: {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
  queryFulfilled: Promise<{ data: IVedtakFullfoertResponse }>;
  catchFn: (e: unknown) => void;
}) => {
  try {
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
      reduxStore.dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
      reduxStore.dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
    }
  } catch (e) {
    catchFn(e);
  }
};

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishOppgavebehandlingParams>({
      query: ({ oppgaveId, nyBehandling }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=${nyBehandling}`,
        method: 'POST',
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled }) => {
        const catchFn = (e: unknown) => {
          const message = 'Kunne ikke fullføre behandling.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        };

        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled, catchFn });
      },
    }),
    finishOppgavebehandlingWithUpdateInGosys: builder.mutation<IVedtakFullfoertResponse, IFinishWithUpdateInGosys>({
      query: ({ oppgaveId, gosysOppgaveUpdate, ignoreGosysOppgave }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer?nybehandling=false`,
        method: 'POST',
        body: { gosysOppgaveUpdate, ignoreGosysOppgave },
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: ({ oppgaveId, kvalitetsvurderingId }, { queryFulfilled }) => {
        const catchFn = (e: unknown) => {
          const message = 'Kunne ikke fullføre behandling.';

          if (isApiRejectionError(e)) {
            // These will be shown inline in the modal
            if (isReduxValidationResponse(e.error)) {
              return;
            }

            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        };

        finishOppgaveOnQueryStarted({ oppgaveId, kvalitetsvurderingId, queryFulfilled, catchFn });
      },
    }),
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: { identifikator: fullmektig?.id ?? null },
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

          toast.success(
            fullmektig === null
              ? 'Fullmektig fjernet'
              : `Fullmektig satt til ${fullmektig.name} (${formatIdNumber(fullmektig.id)})`,
          );
        } catch (e) {
          undo();
          forlengetBehandlingstidPatchResult.undo();
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
        } catch (e) {
          undo();
          const message = 'Kunne ikke oppdatere innsendingshjemler.';

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
  useFinishOppgavebehandlingWithUpdateInGosysMutation,
  useUpdateFullmektigMutation,
  useUpdateKlagerMutation,
  useSetInnsendingshjemlerMutation,
  useSetFeilregistrertMutation,
  useNewAnkebehandlingMutation,
} = behandlingerMutationSlice;
