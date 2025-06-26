import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import {
  isListGodFormulering,
  isListPlainText,
  isListRegelverk,
  isListRichText,
  isPlainText,
  isRichText,
} from '@app/functions/is-rich-plain-text';
import { reduxStore } from '@app/redux/configure-store';
import { getLastPublishedVersion } from '@app/redux-api/redaktoer-helpers';
import { ConsumerTextsTagTypes, consumerTextsApi } from '@app/redux-api/texts/consumer';
import { textsApi } from '@app/redux-api/texts/texts';
import { user } from '@app/static-data/static-data';
import { isApiRejectionError } from '@app/types/errors';
import type { ListGodFormulering, ListPlainText, ListRegelverk, ListRichText } from '@app/types/texts/common';
import { isLanguage, LANGUAGES, UNTRANSLATED } from '@app/types/texts/language';
import type {
  ICreateDraftFromVersionParams,
  IDeleteTextDraftParams,
  IDuplicateVersionParams,
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
  ListText,
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
            textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) =>
              draft.map((t) => (t.id === id ? data : t)),
            ),
          );

          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', id, (_draft) =>
              _draft.map((v) => {
                if (v.versionId === data.versionId) {
                  return data;
                }

                if (v.published) {
                  return { ...v, published: false };
                }

                return v;
              }),
            ),
          );

          for (const maltekstseksjonId of [
            ...data.publishedMaltekstseksjonIdList,
            ...data.draftMaltekstseksjonIdList,
          ]) {
            // Update modifiedOrTextsModified for the maltekstseksjon. It is is given that it references the text.
            dispatch(
              maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', maltekstseksjonId, (draft) => ({
                ...draft,
                modifiedOrTextsModified: data.modified,
              })),
            );

            // Update modifiedOrTextsModified for all versions of the maltekstseksjon that reference the text. Not all versions are given to reference the text.
            dispatch(
              maltekstseksjonerQuerySlice.util.updateQueryData(
                'getMaltekstseksjonVersions',
                maltekstseksjonId,
                (draft) =>
                  draft.map((v) => {
                    if (v.textIdList.includes(id)) {
                      return { ...v, modifiedOrTextsModified: data.modified };
                    }

                    return v;
                  }),
              ),
            );
          }

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

        let textToMove: ListText | undefined;

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
            if (textToMove !== undefined && isListRichText(textToMove)) {
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
        const undo = update(id, { title });
        const undoList = updateList(id, { title }, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query);
        } catch {
          undo();
          undoList();
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
          textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) => draft.filter((t) => t.id !== id)),
        );

        dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) => {
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
    duplicateVersion: builder.mutation<IText, IDuplicateVersionParams>({
      query: ({ id, versionId }) => ({
        method: 'POST',
        url: `/texts/${id}/duplicate`,
        body: { versionId },
      }),
      onQueryStarted: async ({ title, query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success(`Duplikat av «${title}» opprettet.`);

        dispatch(textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) => [data, ...draft]));
        dispatch(textsQuerySlice.util.updateQueryData('getTextById', data.id, () => data));
        dispatch(textsQuerySlice.util.upsertQueryData('getTextVersions', data.id, [data]));
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

        dispatch(textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) => [data, ...draft]));
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
          textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) =>
            draft.map((text) => {
              if (text.id === id) {
                if (textDraft !== undefined) {
                  return textDraft;
                }

                if (text.published) {
                  return { ...text, published: false };
                }
              }

              return text;
            }),
          ),
        );

        const idPatchResult = dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => textDraft));

        const versionsPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.map((text) => (text.published ? { ...text, published: false } : text)),
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
        const lastPublishedVersion = getLastPublishedVersion(versions);

        const versionsPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', id, (draft) =>
            draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ),
        );

        const listPatchResult = dispatch(
          textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) => {
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

    updateRichText: builder.mutation<IRichText, IUpdateRichTextContentParams>({
      query: ({ id, richText, language }) => ({
        method: 'PUT',
        url: `/texts/${id}/${language}/richtext`,
        body: { richText },
      }),
      onQueryStarted: async ({ id, richText, query, language }, { queryFulfilled }) => {
        const upd = <T extends IText | ListText>(t: T) => {
          if (isListRegelverk(t)) {
            if (language === UNTRANSLATED && richText !== null) {
              return { ...t, richText: { ...t.richText, [UNTRANSLATED]: richText } };
            }

            return t;
          }

          if (isListGodFormulering(t)) {
            if (isLanguage(language)) {
              return { ...t, richText: { ...t.richText, [language]: richText } };
            }

            return t;
          }

          if (isListRichText(t)) {
            if (isLanguage(language)) {
              return { ...t, richText: { ...t.richText, [language]: richText } };
            }

            return t;
          }

          return t;
        };

        const undo = update(id, upd);
        const undoList = updateList(id, upd, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          undo();
          undoList();
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
        const upd = <T extends IText | ListText>(t: T) =>
          isListPlainText(t) ? { ...t, plainText: { ...t.plainText, [language]: plainText } } : t;

        const undo = update(id, upd);
        const undoList = updateList(id, upd, query);

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          undo();
          undoList();
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
        const undo = update(id, { templateSectionIdList });

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
        const undo = update(id, { ytelseHjemmelIdList });

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
        const undo = update(id, { utfallIdList });

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
        const undo = update(id, { enhetIdList });

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
type UpdateListFn = (text: ListText) => ListText;

type Update = Partial<
  Pick<IText, 'title' | 'templateSectionIdList' | 'utfallIdList' | 'ytelseHjemmelIdList' | 'enhetIdList'> &
    (Pick<IRichText, 'richText'> &
      Pick<IPlainText, 'plainText'> &
      Pick<IRegelverk, 'richText'> &
      Pick<IGodFormulering, 'richText'>)
>;

type UpdateList = Partial<
  Pick<ListText, 'title'> &
    (Pick<ListRichText, 'richText'> &
      Pick<ListPlainText, 'plainText'> &
      Pick<ListRegelverk, 'richText'> &
      Pick<ListGodFormulering, 'richText'>)
>;

const updateList = (id: string, upd: UpdateList | UpdateListFn, query: IGetTextsParams) =>
  reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) =>
      draft.map((t) => {
        if (t.published || t.publishedDateTime !== null || t.id !== id) {
          return t;
        }

        return typeof upd === 'function' ? upd(t) : { ...t, ...upd };
      }),
    ),
  ).undo;

const update = (id: string, upd: Update | UpdateFn) => {
  const idPatchResult = reduxStore.dispatch(
    textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
      if (draft.published || draft.publishedDateTime !== null) {
        return draft;
      }

      return typeof upd === 'function' ? upd(draft) : { ...draft, ...upd };
    }),
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
    textsQuerySlice.util.updateQueryData('getTexts', { ...query }, (draft) =>
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
  useDuplicateVersionMutation,
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
