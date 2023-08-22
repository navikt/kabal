import { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import { IGetSmartEditorParams } from '@app/types/smart-editor/params';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const smartEditorQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getSmartEditors: builder.query<ISmartEditor[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
    }),

    getSmartEditor: builder.query<ISmartEditor | null, IGetSmartEditorParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
    }),
  }),
});

export const { useGetSmartEditorsQuery, useLazyGetSmartEditorQuery, useGetSmartEditorQuery } = smartEditorQuerySlice;
