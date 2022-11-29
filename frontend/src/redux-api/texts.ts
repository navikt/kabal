import { createApi } from '@reduxjs/toolkit/query/react';
import { VERSION } from '../components/rich-text/version';
import { toast } from '../components/toast/store';
import { ToastType } from '../components/toast/types';
import { queryStringify } from '../functions/query-string';
import { VersionedText } from '../types/rich-text/versions';
import {
  IGetTextsParams,
  INewTextParams,
  IText,
  IUpdatePlainTextPropertyParams,
  IUpdateRichTextPropertyParams,
  IUpdateText,
  IUpdateTextParams,
} from '../types/texts/texts';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from './common';
import { ListTagTypes } from './tag-types';

const versionGuard = (t: VersionedText): t is IText => t.version === VERSION;

const transformResponse = (t: VersionedText): IText => {
  if (!versionGuard(t)) {
    throw new Error('Version mismatch');
  }

  return t;
};

enum TextListTagTypes {
  TEXTS = 'texts',
}

const textsListTags = (messages: IText[] | undefined) =>
  typeof messages === 'undefined'
    ? [{ type: TextListTagTypes.TEXTS, id: ListTagTypes.PARTIAL_LIST }]
    : messages
        .map(({ id }) => ({ type: TextListTagTypes.TEXTS, id }))
        .concat({ type: TextListTagTypes.TEXTS, id: ListTagTypes.PARTIAL_LIST });

export const textsApi = createApi({
  reducerPath: 'textsApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(TextListTagTypes),
  endpoints: (builder) => ({
    getTexts: builder.query<IText[], IGetTextsParams>({
      query: (query) => `/texts/${queryStringify(query)}`,
      transformResponse: (t: VersionedText[]) => t.map(transformResponse),
      providesTags: textsListTags,
    }),
    getTextById: builder.query<IText, string>({
      query: (id) => `/texts/${id}`,
      transformResponse,
    }),
    addText: builder.mutation<IText, { text: INewTextParams; query: IGetTextsParams }>({
      query: ({ text }) => ({
        method: 'POST',
        url: '/texts',
        body: text,
      }),
      transformResponse,
      onQueryStarted: async ({ query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        toast({ type: ToastType.SUCCESS, message: 'Ny tekst opprettet.' });
        dispatch(textsApi.util.updateQueryData('getTexts', query, (draft) => [...draft, data]));
        dispatch(textsApi.util.updateQueryData('getTextById', data.id, () => data));
      },
    }),
    updateText: builder.mutation<IText, IUpdateTextParams>({
      query: ({ text }) => ({
        method: 'PUT',
        url: `/texts/${text.id}`,
        body: text,
      }),
      onQueryStarted: async ({ text, query }, { queryFulfilled, dispatch }) => {
        const idPatchResult = dispatch(textsApi.util.updateQueryData('getTextById', text.id, () => text));
        const queryPatchResult = dispatch(
          textsApi.util.updateQueryData('getTexts', query, (draft) => draft.map((t) => (t.id === text.id ? text : t)))
        );

        try {
          const { data } = await queryFulfilled;
          const { modified } = data;

          toast({ type: ToastType.SUCCESS, message: `Teksten "${text.title}" ble oppdatert.` });

          dispatch(textsApi.util.updateQueryData('getTextById', text.id, (t) => ({ ...t, modified })));
          dispatch(
            textsApi.util.updateQueryData('getTexts', query, (draft) =>
              draft.map((t) => (t.id === text.id ? { ...t, modified } : t))
            )
          );
        } catch {
          idPatchResult.undo();
          queryPatchResult.undo();
        }
      },
    }),
    updateTextProperty: builder.mutation<IText, IUpdatePlainTextPropertyParams | IUpdateRichTextPropertyParams>({
      query: ({ id, key, value }) => {
        const url = `/texts/${id}/${key.toLowerCase()}`;

        return {
          method: 'PUT',
          url,
          body: {
            [key]: value,
          },
        };
      },
      transformResponse,
      onQueryStarted: async ({ id, key, value, query }, { queryFulfilled, dispatch }) => {
        const idPatchResult = dispatch(
          textsApi.util.updateQueryData('getTextById', id, (draft) => ({ ...draft, [key]: value }))
        );

        const queryPatchResult = dispatch(
          textsApi.util.updateQueryData('getTexts', query, (draft) =>
            draft.map((t) => (t.id === id ? { ...t, [key]: value } : t))
          )
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            textsApi.util.updateQueryData('getTextById', id, (draft) => ({ ...draft, modified: data.modified }))
          );

          dispatch(
            textsApi.util.updateQueryData('getTexts', query, (draft) =>
              draft.map((t) => (t.id === id ? { ...t, modified: data.modified } : t))
            )
          );
        } catch {
          idPatchResult.undo();
          queryPatchResult.undo();
        }
      },
    }),
    deleteText: builder.mutation<void, { id: string; title: string; query: IGetTextsParams }>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/texts/${id}`,
      }),
      onQueryStarted: async ({ id, title, query }, { queryFulfilled, dispatch }) => {
        const listPatchResult = dispatch(
          textsApi.util.updateQueryData('getTexts', query, (draft) => draft.filter((text) => text.id !== id))
        );
        const idPatchResult = dispatch(textsApi.util.updateQueryData('getTextById', id, () => undefined));

        try {
          await queryFulfilled;
          toast({ type: ToastType.SUCCESS, message: `Teksten "${title}" ble slettet.` });
        } catch {
          idPatchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
    migrateGetAllTexts: builder.query<VersionedText[], void>({
      query: () => ({
        method: 'GET',
        url: '/migrations/texts',
      }),
    }),
    migrateUpdateTexts: builder.mutation<IText[], IUpdateText[]>({
      query: (body) => ({
        method: 'PUT',
        url: '/migrations/texts',
        body,
      }),
      onQueryStarted: async (texts, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast({ type: ToastType.SUCCESS, message: `${texts.length} tekster migrert.` });

        data.forEach((t) => {
          dispatch(textsApi.util.updateQueryData('getTextById', t.id, () => t));
        });

        dispatch(textsApi.util.updateQueryData('migrateGetAllTexts', undefined, () => []));

        dispatch(textsApi.util.invalidateTags([{ type: TextListTagTypes.TEXTS, id: ListTagTypes.PARTIAL_LIST }]));
      },
    }),
  }),
});

export const {
  useGetTextByIdQuery,
  useGetTextsQuery,
  useLazyGetTextsQuery,
  useAddTextMutation,
  useDeleteTextMutation,
  // useUpdateTextPropertyMutation,
  useLazyMigrateGetAllTextsQuery,
  useMigrateUpdateTextsMutation,
  useUpdateTextMutation,
} = textsApi;
