/* eslint-disable max-lines */
import { formatISO } from 'date-fns';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isPlainText, isRichText } from '@app/functions/is-rich-plain-text';
import { reduxStore } from '@app/redux/configure-store';
import { textsApi } from '@app/redux-api/texts/texts';
import { isApiRejectionError } from '@app/types/errors';
import {
  ICreateDraftFromVersionParams,
  IDeleteTextDraftParams,
  IGetTextsParams,
  INewTextParams,
  IUnpublishTextParams,
  IUpdateBaseParams,
  IUpdateTextContentParams,
  IUpdateTextEnheterParams,
  IUpdateTextPlainTextParams,
  IUpdateTextTemplateSectionIdListParams,
  IUpdateTextTypeParams,
  IUpdateTextUtfallIdListParams,
  IUpdateTextYtelseHjemmelIdListParams,
} from '@app/types/texts/params';
import {
  IDraftRichText,
  IPlainText,
  IPublishedPlainText,
  IPublishedRichText,
  IRichText,
  IText,
} from '@app/types/texts/responses';
import { IDeleteDraftOrUnpublishTextResponse } from '@app/types/texts/responses-maltekster';
import { maltekstseksjonerQuerySlice } from '../maltekstseksjoner/queries';
import { textsQuerySlice } from './queries';

const textsMutationSlice = textsApi.injectEndpoints({
  endpoints: (builder) => ({
    publish: builder.mutation<IPublishedPlainText, IUpdateBaseParams>({
      query: ({ id }) => ({
        method: 'POST',
        url: `/texts/${id}/publish`,
      }),
      onQueryStarted: async ({ id, query }, { queryFulfilled, dispatch }) => {
        const idPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (draft.publishedDateTime !== null) {
              return draft;
            }

            if (isPlainText(draft)) {
              const updated: IPublishedPlainText = {
                ...draft,
                publishedBy: '',
                published: true,
                publishedDateTime: formatISO(new Date()),
              };

              return updated;
            }

            const updated: IPublishedRichText = {
              ...draft,
              publishedBy: '',
              published: true,
              publishedDateTime: formatISO(new Date()),
            };

            return updated;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          toast.success(`Teksten «${data.title}» ble publisert.`);

          dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => data));

          dispatch(
            textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
              draft.map((t) => (t.id === id ? data : t)),
            ),
          );

          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
              draft.map((v) => (v.versionId === data.versionId ? data : { ...v, published: false })),
            ),
          );
        } catch {
          idPatchResult.undo();
        }
      },
    }),
    setTextType: builder.mutation<IRichText, IUpdateTextTypeParams>({
      query: ({ id, newTextType }) => ({
        method: 'PUT',
        url: `/texts/${id}/texttype`,
        body: { textType: newTextType },
      }),
      onQueryStarted: async ({ id, newTextType, oldTextType }, { queryFulfilled, dispatch }) => {
        const idPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (draft.publishedDateTime !== null) {
              return draft;
            }

            if (isPlainText(draft)) {
              return draft;
            }

            return { ...draft, textType: newTextType };
          }),
        );

        let textToMove: IText | undefined = undefined;

        const movedFromListPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { textType: oldTextType }, (draft) =>
            draft.filter((t) => {
              if (t.id === id) {
                textToMove = t;

                return false;
              }

              return true;
            }),
          ),
        );

        const movedToListPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { textType: newTextType }, (draft) => {
            if (textToMove !== undefined && isRichText(textToMove)) {
              draft.push({ ...textToMove, textType: newTextType });
            }
          }),
        );

        const versionPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) => {
            for (const version of draft) {
              if (version.publishedDateTime === null && !isPlainText(version)) {
                version.textType = newTextType;

                continue;
              }
            }
          }),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, { textType: newTextType });
        } catch {
          idPatchResult.undo();
          movedToListPatchResult.undo();
          movedFromListPatchResult.undo();
          versionPatchResult.undo();
        }
      },
    }),
    setTextTitle: builder.mutation<IText, { id: string; title: string; query: IGetTextsParams }>({
      query: ({ id, title }) => ({
        method: 'PUT',
        url: `/texts/${id}/title`,
        body: { title },
      }),
      onQueryStarted: async ({ id, title, query }, { queryFulfilled }) => {
        const undo = update(id, { title }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
        }
      },
    }),
    createDraftFromVersion: builder.mutation<IText, ICreateDraftFromVersionParams>({
      query: ({ id, versionId }) => ({
        method: 'POST',
        url: `/texts/${id}/draft`,
        body: { versionId },
      }),
      onQueryStarted: async ({ id, title, query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success(`Nytt utkast for «${title}» opprettet.`);

        dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) => [
            data,
            ...draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ]),
        );
        dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => data));
        dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
            draft.map((t) => (t.id === id ? data : t)),
          ),
        );
      },
    }),
    addText: builder.mutation<IText, { text: INewTextParams; query: IGetTextsParams }>({
      query: ({ text }) => ({
        method: 'POST',
        url: '/texts',
        body: text,
      }),
      onQueryStarted: async ({ query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success('Ny tekst opprettet.');

        dispatch(textsQuerySlice.util.updateQueryData('getTexts', query, (draft) => [...draft, data]));
        dispatch(textsQuerySlice.util.updateQueryData('getTextById', data.id, () => data));
      },
    }),
    // Unpublish text. Preserve draft.
    unpublishText: builder.mutation<IDeleteDraftOrUnpublishTextResponse, IUnpublishTextParams>({
      query: ({ id }) => ({
        method: 'POST',
        url: `/texts/${id}/unpublish`,
      }),
      onQueryStarted: async ({ id, title, query, textDraft }, { queryFulfilled, dispatch }) => {
        const listPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
            textDraft === undefined
              ? draft.filter((text) => text.id !== id)
              : draft.map((text) => (text.id === id ? textDraft : text)),
          ),
        );

        const idPatchResult = dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => textDraft));

        const versionsPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.map((text) => ({ ...text, published: false })),
          ),
        );

        try {
          const { data } = await queryFulfilled;

          toast.success(`Teksten «${title}» ble avpublisert.`);

          for (const { maltekstseksjonId, maltekstseksjonVersions } of data.maltekstseksjonVersions) {
            dispatch(
              maltekstseksjonerQuerySlice.util.updateQueryData(
                'getMaltekstseksjonVersions',
                maltekstseksjonId,
                () => maltekstseksjonVersions,
              ),
            );
          }
        } catch (e) {
          idPatchResult.undo();
          listPatchResult.undo();
          versionsPatchResult.undo();

          const message = 'Kunne ikke avpublisere tekst.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    deleteDraft: builder.mutation<IDeleteDraftOrUnpublishTextResponse, IDeleteTextDraftParams>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/texts/${id}/draft`,
      }),
      onQueryStarted: async ({ id, title, query, lastPublishedVersion }, { queryFulfilled, dispatch }) => {
        const versionsPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ),
        );

        const listPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', query, (draft) => {
            if (lastPublishedVersion === undefined) {
              return draft.filter((text) => text.id !== id);
            }

            return draft.map((text) => (text.id === id ? lastPublishedVersion : text));
          }),
        );

        const idPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, () => lastPublishedVersion),
        );

        try {
          const { data } = await queryFulfilled;

          toast.success(`Utkast for «${title}» ble slettet.`);

          for (const { maltekstseksjonId, maltekstseksjonVersions } of data.maltekstseksjonVersions) {
            dispatch(
              maltekstseksjonerQuerySlice.util.updateQueryData(
                'getMaltekstseksjonVersions',
                maltekstseksjonId,
                (draft) =>
                  draft.map(
                    (version) => maltekstseksjonVersions.find((v) => v.versionId === version.versionId) ?? version,
                  ),
              ),
            );
          }
        } catch {
          versionsPatchResult.undo();
          idPatchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
    updateContent: builder.mutation<IRichText, IUpdateTextContentParams>({
      query: ({ id, ...body }) => ({
        method: 'PUT',
        url: `/texts/${id}/content`,
        body,
      }),
      onQueryStarted: async ({ id, richText, language, query }, { queryFulfilled }) => {
        const idPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (draft.publishedDateTime !== null) {
              return draft;
            }

            if (isRichText(draft)) {
              return { ...draft, richText: { ...draft.richText, [language]: richText } };
            }

            return draft;
          }),
        );

        const listPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
            draft.map((t) =>
              t.publishedDateTime === null && t.id === id && isRichText(t)
                ? { ...t, richText: { ...t.richText, [language]: richText } }
                : t,
            ),
          ),
        );

        const versionPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.map((t) =>
              t.publishedDateTime === null && t.id === id && isRichText(t)
                ? { ...t, richText: { ...t.richText, [language]: richText } }
                : t,
            ),
          ),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          idPatchResult.undo();
          listPatchResult.undo();
          versionPatchResult.undo();
        }
      },
    }),
    updatePlainText: builder.mutation<IPlainText, IUpdateTextPlainTextParams>({
      query: ({ id, plainText }) => ({
        method: 'PUT',
        url: `/texts/${id}/plaintext`,
        body: { plainText },
      }),
      onQueryStarted: async ({ id, plainText, language, query }, { queryFulfilled }) => {
        const idPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (draft.publishedDateTime !== null) {
              return draft;
            }

            if (isPlainText(draft)) {
              return { ...draft, plainText: { ...draft.plainText, [language]: plainText } };
            }

            return draft;
          }),
        );

        const listPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
            draft.map((t) =>
              t.publishedDateTime === null && t.id === id && isPlainText(t)
                ? { ...t, plainText: { ...t.plainText, [language]: plainText } }
                : t,
            ),
          ),
        );

        const versionPatchResult = reduxStore.dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.map((t) =>
              t.publishedDateTime === null && t.id === id && isPlainText(t)
                ? { ...t, plainText: { ...t.plainText, [language]: plainText } }
                : t,
            ),
          ),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          idPatchResult.undo();
          listPatchResult.undo();
          versionPatchResult.undo();
        }
      },
    }),
    updateTemplateSectionIdList: builder.mutation<IDraftRichText, IUpdateTextTemplateSectionIdListParams>({
      query: ({ id, templateSectionIdList }) => ({
        method: 'PUT',
        url: `/texts/${id}/template-section-id-list`,
        body: { templateSectionIdList },
      }),
      onQueryStarted: async ({ id, templateSectionIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { templateSectionIdList }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
        }
      },
    }),

    updateYtelseHjemmelIdList: builder.mutation<IDraftRichText, IUpdateTextYtelseHjemmelIdListParams>({
      query: ({ id, ytelseHjemmelIdList }) => ({
        method: 'PUT',
        url: `/texts/${id}/ytelse-hjemmel-id-list`,
        body: { ytelseHjemmelIdList },
      }),
      onQueryStarted: async ({ id, ytelseHjemmelIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { ytelseHjemmelIdList }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
        }
      },
    }),

    updateUtfallIdList: builder.mutation<IDraftRichText, IUpdateTextUtfallIdListParams>({
      query: ({ id, utfallIdList }) => ({
        method: 'PUT',
        url: `/texts/${id}/utfall-id-list`,
        body: { utfallIdList },
      }),
      onQueryStarted: async ({ id, utfallIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { utfallIdList }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
        }
      },
    }),

    updateEnhetIdList: builder.mutation<IDraftRichText, IUpdateTextEnheterParams>({
      query: ({ id, enhetIdList }) => ({
        method: 'PUT',
        url: `/texts/${id}/enhet-id-list`,
        body: { enhetIdList },
      }),
      onQueryStarted: async ({ id, enhetIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { enhetIdList }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
        }
      },
    }),
  }),
});

type Update = Partial<
  Pick<IText, 'title' | 'templateSectionIdList' | 'utfallIdList' | 'ytelseHjemmelIdList' | 'enhetIdList'>
>;

const update = (id: string, upd: Update, query: IGetTextsParams) => {
  const idPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
      if (draft.publishedDateTime !== null) {
        return draft;
      }

      return { ...draft, ...upd };
    }),
  );

  const listPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
      draft.map((t) => (t.publishedDateTime === null && t.id === id ? { ...t, ...upd } : t)),
    ),
  );

  const versionPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
      draft.map((version) => {
        if (version.published || version.publishedDateTime !== null) {
          return version;
        }

        return { ...version, ...upd };
      }),
    ),
  );

  return () => {
    idPatchResult.undo();
    listPatchResult.undo();
    versionPatchResult.undo();
  };
};

const pessimisticUpdate = (id: string, data: IText, query: IGetTextsParams, showToast = true) => {
  const { modified, title, editors } = data;

  if (showToast) {
    toast.success(`Malteksten «${title}» ble oppdatert.`);
  }

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => ({ ...draft, modified, editors })),
  );

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
      draft.map((t) => (t.publishedDateTime === null && t.id === id ? { ...t, modified, editors } : t)),
    ),
  );

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
      draft.map((version) => {
        if (version.published || version.publishedDateTime !== null) {
          return version;
        }

        return { ...version, modified, editors };
      }),
    ),
  );
};

export const {
  usePublishMutation,
  useAddTextMutation,
  useCreateDraftFromVersionMutation,
  useUnpublishTextMutation,
  useSetTextTypeMutation,
  useSetTextTitleMutation,
  useDeleteDraftMutation,
  useUpdateContentMutation,
  useUpdatePlainTextMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateEnhetIdListMutation,
} = textsMutationSlice;
