/* eslint-disable max-lines */
import { formatISO } from 'date-fns';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isDraftPlainTextVersion, isPlainText, isPlainTextType, isRichText } from '@app/functions/is-rich-plain-text';
import { reduxStore } from '@app/redux/configure-store';
import { textsApi } from '@app/redux-api/texts/texts';
import { isApiRejectionError } from '@app/types/errors';
import { LANGUAGES } from '@app/types/texts/language';
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
  DraftPlainTextVersion,
  DraftRichTextVersion,
  IDraftRichText,
  IPlainText,
  IPublishedPlainText,
  IPublishedRichText,
  IRichText,
  IText,
  PublishedPlainTextVersion,
  PublishedRichTextVersion,
} from '@app/types/texts/responses';
import { IDeleteDraftOrUnpublishTextResponse } from '@app/types/texts/responses-maltekster';
import { maltekstseksjonerQuerySlice } from '../maltekstseksjoner/queries';
import { textsQuerySlice } from './queries';

const textsMutationSlice = textsApi.injectEndpoints({
  endpoints: (builder) => ({
    publish: builder.mutation<PublishedPlainTextVersion | PublishedRichTextVersion, IUpdateBaseParams>({
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

          // dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => data));

          // dispatch(
          //   textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
          //     draft.map((t) => (t.id === id ? data : t)),
          //   ),
          // );

          for (const language of LANGUAGES) {
            dispatch(
              textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
                draft.map((v) => (v.versionId === data.versionId ? data : { ...v, published: false })),
              ),
            );
          }
        } catch {
          idPatchResult.undo();
        }
      },
    }),
    setTextType: builder.mutation<DraftRichTextVersion | DraftPlainTextVersion, IUpdateTextTypeParams>({
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

        const versionPatchResults = LANGUAGES.map((language) =>
          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) => {
              for (const version of draft) {
                if (version.publishedDateTime === null && !isDraftPlainTextVersion(version)) {
                  version.textType = newTextType;

                  continue;
                }
              }
            }),
          ),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, { textType: newTextType });
        } catch {
          idPatchResult.undo();
          movedToListPatchResult.undo();
          movedFromListPatchResult.undo();
          versionPatchResults.forEach((patch) => patch.undo());
        }
      },
    }),
    setTextTitle: builder.mutation<IText, { id: string; title: string; query: IGetTextsParams }>({
      query: ({ id, title }) => ({
        method: 'PUT',
        url: `/texts/${id}/title`,
        body: { title },
      }),
      onQueryStarted: async ({ id, title, query }, { queryFulfilled, dispatch }) => {
        const undo = update(id, { title }, query);

        try {
          const { data } = await queryFulfilled;

          dispatch(textsQuerySlice.util.updateQueryData('getTextById', id, () => data));
        } catch {
          undo();
        }
      },
    }),
    createDraftFromVersion: builder.mutation<DraftRichTextVersion, ICreateDraftFromVersionParams>({
      query: ({ id, versionId }) => ({
        method: 'POST',
        url: `/richtexts/${id}/draft`,
        body: { versionId },
      }),
      onQueryStarted: async ({ id, title, query, language }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success(`Nytt utkast for «${title}» opprettet.`);

        dispatch(
          textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) => [
            data,
            ...draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ]),
        );

        dispatch(
          textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
            if (!isRichText(draft)) {
              return draft;
            }

            draft.richText[language] = [data.id, ...draft.richText[language]];

            return draft;
          }),
        );

        // TODO: Update getTextsList to include the new draft.

        // dispatch(
        //   textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
        //     draft.map((t) => (t.id === id ? data : t)),
        //   ),
        // );
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

        const versionsPatchResults = LANGUAGES.map((language) =>
          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
              draft.map((text) => ({ ...text, published: false })),
            ),
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
          versionsPatchResults.forEach((patch) => patch.undo());

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
      query: ({ id, query }) => ({
        method: 'DELETE',
        url: isPlainTextType(query.textType) ? `/plaintexts/${id}` : `/richtexts/${id}`,
      }),
      onQueryStarted: async ({ id, title, query, lastPublishedVersion }, { queryFulfilled, dispatch }) => {
        const versionsPatchResults = LANGUAGES.map((language) =>
          dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
              draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
            ),
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
          versionsPatchResults.forEach((patch) => patch.undo());
          idPatchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
    updateContent: builder.mutation<DraftRichTextVersion, IUpdateTextContentParams>({
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
          textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
            draft.map((t) =>
              t.publishedDateTime === null && t.id === id && !isDraftPlainTextVersion(t)
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
    updatePlainText: builder.mutation<DraftPlainTextVersion, IUpdateTextPlainTextParams>({
      query: ({ id, plainText }) => ({
        method: 'PUT',
        url: `/plaintexts/${id}`,
        body: { plainText },
      }),
      onQueryStarted: async ({ id, plainText, query }, { queryFulfilled }) => {
        // const idPatchResult = reduxStore.dispatch(
        //   textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => {
        //     if (draft.publishedDateTime !== null) {
        //       return draft;
        //     }

        //     if (isPlainText(draft)) {
        //       return { ...draft, plainText: { ...draft.plainText, [language]: plainText } };
        //     }

        //     return draft;
        //   }),
        // );

        // const listPatchResult = reduxStore.dispatch(
        //   textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
        //     draft.map((t) =>
        //       t.publishedDateTime === null && t.id === id && isPlainText(t)
        //         ? { ...t, plainText: { ...t.plainText, [language]: plainText } }
        //         : t,
        //     ),
        //   ),
        // );

        const versionPatchResults = LANGUAGES.map((language) =>
          reduxStore.dispatch(
            textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
              draft.map((t) =>
                t.publishedDateTime === null && t.id === id && isDraftPlainTextVersion(t) ? { ...t, plainText } : t,
              ),
            ),
          ),
        );

        try {
          pessimisticUpdate(id, (await queryFulfilled).data, query, false);
        } catch {
          // idPatchResult.undo();
          // listPatchResult.undo();
          versionPatchResults.forEach((patch) => patch.undo());
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
          await queryFulfilled;
          // pessimisticUpdate(id, (await queryFulfilled).data, query);
          // TODO: templateSectionIdList is to be removed from texts?
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
          await queryFulfilled;
          // pessimisticUpdate(id, (await queryFulfilled).data, query);
          // TODO: ytelseHjemmelIdList is to be removed from texts?
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
          await queryFulfilled;
          // pessimisticUpdate(id, (await queryFulfilled).data, query);
          // TODO: utfallIdList is to be removed from texts?
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
          await queryFulfilled;
          // pessimisticUpdate(id, (await queryFulfilled).data, query);
          // TODO: enhetIdList is to be removed from texts?
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

  const versionPatchResults = LANGUAGES.map((language) =>
    reduxStore.dispatch(
      textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
        draft.map((version) => {
          if (version.published || version.publishedDateTime !== null) {
            return version;
          }

          return { ...version, ...upd };
        }),
      ),
    ),
  );

  return () => {
    idPatchResult.undo();
    listPatchResult.undo();
    versionPatchResults.forEach((patch) => patch.undo());
  };
};

const pessimisticUpdate = (
  id: string,
  data: DraftPlainTextVersion | DraftRichTextVersion,
  query: IGetTextsParams,
  showToast = true,
) => {
  const { modified, title, editors } = data;

  if (showToast) {
    toast.success(`Malteksten «${title}» ble oppdatert.`);
  }

  // reduxStore.dispatch(
  //   textsQuerySlice.util.updateQueryData('getTextById', id, (draft) => ({ ...draft, modified, editors })),
  // );

  // reduxStore.dispatch(
  //   textsQuerySlice.util.updateQueryData('getTexts', query, (draft) =>
  //     draft.map((t) => (t.publishedDateTime === null && t.id === id ? { ...t, modified, editors } : t)),
  //   ),
  // );

  for (const language of LANGUAGES) {
    reduxStore.dispatch(
      textsQuerySlice.util.updateQueryData('getTextVersions', { id, language }, (draft) =>
        draft.map((version) => {
          if (version.published || version.publishedDateTime !== null) {
            return version;
          }

          return { ...version, modified, editors };
        }),
      ),
    );
  }
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
