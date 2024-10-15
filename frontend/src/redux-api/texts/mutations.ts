import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isGodFormulering, isPlainText, isRegelverk, isRichText } from '@app/functions/is-rich-plain-text';
import { getLastPublishedAndVersionToShowInTrash } from '@app/redux-api/redaktoer-helpers';
import { ConsumerTextsTagTypes, consumerTextsApi } from '@app/redux-api/texts/consumer';
import { textsApi } from '@app/redux-api/texts/texts';
import { reduxStore } from '@app/redux/configure-store';
import { user } from '@app/static-data/static-data';
import { isApiRejectionError } from '@app/types/errors';
import { LANGUAGES, UNTRANSLATED, isLanguage } from '@app/types/texts/language';
import type {
  ICreateDraftFromVersionParams,
  IDeleteTextDraftParams,
  IGetTextsParams,
  INewTextParams,
  IUnpublishTextParams,
  IUpdateBaseParams,
  IUpdateRichTextContentParams,
  IUpdateTextEnheterParams,
  IUpdateTextPlainTextParams,
  IUpdateTextTemplateSectionIdListParams,
  IUpdateTextTypeParams,
  IUpdateTextUtfallIdListParams,
  IUpdateTextYtelseHjemmelIdListParams,
} from '@app/types/texts/params';
import type {
  IDraftRichText,
  IGodFormulering,
  IPlainText,
  IPublishedText,
  IRegelverk,
  IRichText,
  IText,
} from '@app/types/texts/responses';
import type { IDeleteDraftOrUnpublishTextResponse } from '@app/types/texts/responses-maltekster';
import { formatISO } from 'date-fns';
import { maltekstseksjonerQuerySlice } from '../maltekstseksjoner/queries';
import { textsQuerySlice } from './queries';

const textsMutationSlice = textsApi.injectEndpoints({
  endpoints: (builder) => ({
    publish: builder.mutation<IPublishedText, IUpdateBaseParams>({
      query: ({ id }) => ({
        method: 'POST',
        url: `/texts/${id}/publish`,
      }),
      onQueryStarted: async ({ id, query }, { queryFulfilled, dispatch }) => {
        const { navIdent, navn } = await user;

        const idPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (draft.publishedDateTime !== null) {
              return draft;
            }

            const publishedDateTime = formatISO(new Date());
            const updated = { ...draft, publishedByActor: { navIdent, navn }, published: true, publishedDateTime };

            return updated;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          toast.success(`Teksten «${data.title}» ble publisert.`);

          dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => data));

          dispatch(
            textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) =>
              draft.map((t) => (t.id === id ? data : t)),
            ),
          );

          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
              draft.map((v) => (v.versionId === data.versionId ? data : { ...v, published: false })),
            ),
          );

          invalidateConsumerText(id);
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

            if (isRichText(draft)) {
              return { ...draft, textType: newTextType };
            }
          }),
        );

        let textToMove: IText | undefined = undefined;

        const movedFromListPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { textType: oldTextType, trash: false }, (draft) =>
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
          textsQuerySlice.util.updateQueryData('getTexts', { textType: newTextType, trash: false }, (draft) => {
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
              }
            }
          }),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, { textType: newTextType, trash: false });
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
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: true }, (draft) =>
            draft.filter((t) => t.id !== id),
          ),
        );

        dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) => {
            let found = false;

            const updated = draft.map((text) => {
              if (text.id === id) {
                found = true;

                return data;
              }

              return text;
            });

            return found ? updated : [data, ...draft];
          }),
        );
      },
    }),
    addText: builder.mutation<IText, { text: INewTextParams; query: Omit<IGetTextsParams, 'trash'> }>({
      query: ({ text }) => ({
        method: 'POST',
        url: '/texts',
        body: text,
      }),
      onQueryStarted: async ({ query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success('Ny tekst opprettet.');

        dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) => [data, ...draft]),
        );
        dispatch(textsQuerySlice.util.updateQueryData('getTextById', data.id, () => data));
      },
    }),
    // Unpublish text. Preserve draft.
    unpublishText: builder.mutation<IDeleteDraftOrUnpublishTextResponse, IUnpublishTextParams>({
      query: ({ publishedText }) => ({
        method: 'POST',
        url: `/texts/${publishedText.id}/unpublish`,
      }),
      onQueryStarted: async ({ publishedText, query, textDraft }, { queryFulfilled, dispatch }) => {
        const { id, title } = publishedText;
        const listPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) =>
            textDraft === undefined
              ? draft.filter((text) => text.id !== id)
              : draft.map((text) => (text.id === id ? textDraft : text)),
          ),
        );

        const trashListPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: true }, (draft) =>
            textDraft === undefined ? [{ ...publishedText, published: false }, ...draft] : draft,
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

          invalidateConsumerText(id);
        } catch (e) {
          idPatchResult.undo();
          listPatchResult.undo();
          trashListPatchResult.undo();
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
      onQueryStarted: async ({ id, title, query, versions }, { queryFulfilled, dispatch }) => {
        const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

        const versionsPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ),
        );

        const listPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) => {
            if (lastPublishedVersion === undefined) {
              return draft.filter((text) => text.id !== id);
            }

            return draft.map((text) => (text.id === id ? lastPublishedVersion : text));
          }),
        );

        const trashListPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: true }, (draft) =>
            versionToShowInTrash === undefined ? draft : [versionToShowInTrash, ...draft],
          ),
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
          trashListPatchResult.undo();
          listPatchResult.undo();
        }
      },
    }),

    updateRichText: builder.mutation<IRichText, IUpdateRichTextContentParams>({
      query: ({ id, richText, language }) => ({
        method: 'PUT',
        url: `/texts/${id}/${language}/richtext`,
        body: { richText },
      }),
      onQueryStarted: async ({ id, richText, query, language }, { queryFulfilled }) => {
        const undo = update(
          id,
          (t) => {
            if (isRegelverk(t)) {
              if (language === UNTRANSLATED && richText !== null) {
                return { ...t, richText: { ...t.richText, [UNTRANSLATED]: richText } };
              }

              return t;
            }

            if (isGodFormulering(t)) {
              if (isLanguage(language)) {
                return { ...t, richText: { ...t.richText, [language]: richText } };
              }

              return t;
            }

            if (isRichText(t)) {
              if (isLanguage(language)) {
                return { ...t, richText: { ...t.richText, [language]: richText } };
              }

              return t;
            }

            return t;
          },
          query,
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          undo();
        }
      },
    }),

    updatePlainText: builder.mutation<IPlainText, IUpdateTextPlainTextParams>({
      query: ({ id, plainText, language }) => ({
        method: 'PUT',
        url: `/texts/${id}/${language}/plaintext`,
        body: { plainText },
      }),
      onQueryStarted: async ({ id, plainText, query, language }, { queryFulfilled }) => {
        const undo = update(
          id,
          (t) => (isPlainText(t) ? { ...t, plainText: { ...t.plainText, [language]: plainText } } : t),
          query,
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          undo();
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

type UpdateFn = (text: IText) => IText;

type Update = Partial<
  Pick<IText, 'title' | 'templateSectionIdList' | 'utfallIdList' | 'ytelseHjemmelIdList' | 'enhetIdList'> &
    (Pick<IRichText, 'richText'> &
      Pick<IPlainText, 'plainText'> &
      Pick<IRegelverk, 'richText'> &
      Pick<IGodFormulering, 'richText'>)
>;

const update = (id: string, upd: Update | UpdateFn, query: IGetTextsParams) => {
  const idPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
      if (draft.published || draft.publishedDateTime !== null) {
        return draft;
      }

      return typeof upd === 'function' ? upd(draft) : { ...draft, ...upd };
    }),
  );

  const listPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) =>
      draft.map((t) => {
        if (t.published || t.publishedDateTime !== null || t.id !== id) {
          return t;
        }

        return typeof upd === 'function' ? upd(t) : { ...t, ...upd };
      }),
    ),
  );

  const versionPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
      draft.map((version) => {
        if (version.published || version.publishedDateTime !== null) {
          return version;
        }

        return typeof upd === 'function' ? upd(version) : { ...version, ...upd };
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
  const { modified, title, edits } = data;

  if (showToast) {
    toast.success(`Malteksten «${title}» ble oppdatert.`);
  }

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => ({ ...draft, modified, edits })),
  );

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTexts', { ...query, trash: false }, (draft) =>
      draft.map((t) => (t.publishedDateTime === null && t.id === id ? { ...t, modified, edits } : t)),
    ),
  );

  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
      draft.map((version) => {
        if (version.published || version.publishedDateTime !== null) {
          return version;
        }

        return { ...version, modified, edits };
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
  useUpdateRichTextMutation,
  useUpdatePlainTextMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateEnhetIdListMutation,
} = textsMutationSlice;

const invalidateConsumerText = (id: string) => {
  for (const language of LANGUAGES) {
    reduxStore.dispatch(
      consumerTextsApi.util.invalidateTags([{ type: ConsumerTextsTagTypes.TEXT, id: `${id}-${language}` }]),
    );
  }
};
