import { toast } from '@app/components/toast/store';
import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import type { KabalValue } from '@app/plate/types';
import { reduxStore } from '@app/redux/configure-store';
import {
  ConsumerMaltekstseksjonerTagTypes,
  consumerMaltekstseksjonerApi,
} from '@app/redux-api/maltekstseksjoner/consumer';
import { maltekstseksjonerApi } from '@app/redux-api/maltekstseksjoner/maltekstseksjoner';
import { maltekstseksjonerQuerySlice } from '@app/redux-api/maltekstseksjoner/queries';
import { getLastPublishedVersion } from '@app/redux-api/redaktoer-helpers';
import { ConsumerTextsTagTypes, consumerTextsApi } from '@app/redux-api/texts/consumer';
import { user } from '@app/static-data/static-data';
import type { IGetMaltekstseksjonParams, PublishedTextReadOnlyMetadata } from '@app/types/common-text-types';
import { isApiRejectionError } from '@app/types/errors';
import type {
  ICreateDraftFromMaltekstseksjonVersionParams,
  IDeleteMaltekstDraftParams,
  IDuplicateMaltekstseksjonVersionParams,
  INewMaltekstseksjonParams,
  IUnpublishMaltekstseksjonParams,
  IUpdateBaseParams,
  IUpdateMaltekstseksjonTemplateSectionParams,
  IUpdateMaltekstseksjonTextIsListParams,
  IUpdateMaltekstseksjonTitleParams,
  IUpdateMaltekstseksjonUtfallParams,
  IUpdateMaltekstseksjonYtelseHjemmelParams,
} from '@app/types/maltekstseksjoner/params';
import type {
  IDraftMaltekstseksjon,
  IPublishedMaltekstseksjon,
  IPublishWithTextsResponse,
} from '@app/types/maltekstseksjoner/responses';
import type { INewRichTextParams } from '@app/types/texts/common';
import { LANGUAGES, type Language } from '@app/types/texts/language';
import { formatISO } from 'date-fns';
import type { Patch } from 'immer';
import { textsQuerySlice } from '../texts/queries';

const maltekstseksjonerMutationSlice = maltekstseksjonerApi.injectEndpoints({
  endpoints: (builder) => ({
    createMaltekstseksjon: builder.mutation<IDraftMaltekstseksjon, INewMaltekstseksjonParams>({
      query: ({ maltekstseksjon }) => ({
        method: 'POST',
        url: '/maltekstseksjoner',
        body: maltekstseksjon,
      }),
      onQueryStarted: async ({ query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success('Ny maltekstseksjon opprettet.');

        dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) => [data, ...draft]),
        );
        dispatch(maltekstseksjonerQuerySlice.util.upsertQueryData('getMaltekstseksjonVersions', data.id, [data]));
        dispatch(maltekstseksjonerQuerySlice.util.upsertQueryData('getMaltekstseksjon', data.id, data));
      },
    }),
    updateMaltekstTitle: builder.mutation<IDraftMaltekstseksjon, IUpdateMaltekstseksjonTitleParams>({
      query: ({ id, title }) => ({
        method: 'PUT',
        url: `/maltekstseksjoner/${id}/title`,
        body: { title },
      }),
      onQueryStarted: async ({ id, title, query }, { queryFulfilled }) => {
        const undo = update(id, { title }, query);

        try {
          const { data } = await queryFulfilled;
          update(id, data, query);
          toast.success(`Maltekstseksjonen «${data.title}» sin tittel ble oppdatert.`);
        } catch {
          undo();
        }
      },
    }),
    updateTextIdList: builder.mutation<IDraftMaltekstseksjon, IUpdateMaltekstseksjonTextIsListParams>({
      query: ({ id, textIdList }) => ({
        method: 'PUT',
        url: `/maltekstseksjoner/${id}/text-id-list`,
        body: { textIdList },
      }),
      onQueryStarted: async ({ id, textIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { textIdList }, query);

        try {
          const { data } = await queryFulfilled;
          toast.success(`Maltekstseksjonen «${data.title}» ble oppdatert.`);
          update(id, data, query);
        } catch {
          undo();
        }
      },
    }),
    updateTemplateSectionIdList: builder.mutation<IDraftMaltekstseksjon, IUpdateMaltekstseksjonTemplateSectionParams>({
      query: ({ id, templateSectionIdList }) => ({
        method: 'PUT',
        url: `/maltekstseksjoner/${id}/template-section-id-list`,
        body: { templateSectionIdList },
      }),
      onQueryStarted: async ({ id, templateSectionIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { templateSectionIdList }, query);

        try {
          const { data } = await queryFulfilled;
          toast.success(`Maltekstseksjonen «${data.title}» ble oppdatert.`);
          update(id, data, query);
        } catch {
          undo();
        }
      },
    }),
    updateYtelseHjemmelIdList: builder.mutation<IDraftMaltekstseksjon, IUpdateMaltekstseksjonYtelseHjemmelParams>({
      query: ({ id, ytelseHjemmelIdList }) => ({
        method: 'PUT',
        url: `/maltekstseksjoner/${id}/ytelse-hjemmel-id-list`,
        body: { ytelseHjemmelIdList },
      }),
      onQueryStarted: async ({ id, ytelseHjemmelIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { ytelseHjemmelIdList }, query);

        try {
          const { data } = await queryFulfilled;
          toast.success(`Maltekstseksjonen «${data.title}» ble oppdatert.`);
          update(id, data, query);
        } catch {
          undo();
        }
      },
    }),
    updateUtfallIdList: builder.mutation<IDraftMaltekstseksjon, IUpdateMaltekstseksjonUtfallParams>({
      query: ({ id, utfallIdList }) => ({
        method: 'PUT',
        url: `/maltekstseksjoner/${id}/utfall-id-list`,
        body: { utfallIdList },
      }),
      onQueryStarted: async ({ id, utfallIdList, query }, { queryFulfilled }) => {
        const undo = update(id, { utfallIdList }, query);

        try {
          const { data } = await queryFulfilled;
          toast.success(`Maltekstseksjonen «${data.title}» ble oppdatert.`);
          update(id, data, query);
        } catch {
          undo();
        }
      },
    }),
    publish: builder.mutation<IPublishedMaltekstseksjon, IUpdateBaseParams>({
      query: ({ id }) => ({
        method: 'POST',
        url: `/maltekstseksjoner/${id}/publish`,
      }),
      onQueryStarted: async ({ id, query }, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;

          toast.success('Maltekstseksjon publisert.');

          dispatch(
            maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
              draft.map((t) => (t.id === id ? data : t)),
            ),
          );
          dispatch(maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => data));
          dispatch(
            maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) =>
              draft.map((v) => {
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
        } catch (error) {
          const heading = 'Kunne ikke publisere maltekstseksjon';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    publishWithTexts: builder.mutation<IPublishWithTextsResponse, IUpdateBaseParams>({
      query: ({ id }) => ({
        method: 'POST',
        url: `/maltekstseksjoner/${id}/publish-with-texts`,
      }),
      onQueryStarted: async ({ id, query }, { queryFulfilled, dispatch }) => {
        interface PatchResult {
          undo: () => void;
          patches: Patch[];
          inversePatches: Patch[];
        }
        const textPatches: PatchResult[] = [];

        const { navIdent, navn } = await user;

        const maltekstseksjonerPatch = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
            draft.map((section) => {
              if (section.id === id) {
                const publishedDateTime = formatISO(new Date());

                const publishedProps: Pick<
                  PublishedTextReadOnlyMetadata,
                  'published' | 'publishedDateTime' | 'publishedByActor'
                > = { published: true, publishedDateTime, publishedByActor: { navIdent, navn } };

                for (const textId of section.textIdList) {
                  textPatches.push(
                    ...LANGUAGES.map((language) =>
                      dispatch(
                        consumerTextsApi.util.updateQueryData(
                          'getConsumerTextById',
                          { textId, language },
                          (textDraft) => ({
                            ...textDraft,
                            publishedDateTime: publishedProps.publishedDateTime,
                          }),
                        ),
                      ),
                    ),
                    dispatch(
                      textsQuerySlice.util.updateQueryData('getTextById', textId, (textDraft) => ({
                        ...textDraft,
                        ...publishedProps,
                      })),
                    ),
                    dispatch(
                      textsQuerySlice.util.updateQueryData('getTextVersions', textId, (versionsDraft) => {
                        const [draftVersion, ...rest] = versionsDraft;

                        if (draftVersion === undefined || draftVersion.publishedDateTime !== null) {
                          return versionsDraft;
                        }

                        return [{ ...draftVersion, ...publishedProps }, ...rest];
                      }),
                    ),
                  );
                }

                return { ...section, ...publishedProps };
              }

              return section;
            }),
          ),
        );

        try {
          const { data } = await queryFulfilled;
          const { maltekstseksjon, publishedTexts } = data;

          const textCount = publishedTexts.length;

          if (textCount === 0) {
            toast.success('Maltekstseksjon publisert.');
          } else {
            toast.success(
              `Maltekstseksjon og ${textCount} tilhørende ${textCount === 1 ? 'tekst' : 'tekster'} publisert.`,
            );
          }

          dispatch(
            maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
              draft.map((ms) => (ms.id === id ? maltekstseksjon : ms)),
            ),
          );
          dispatch(maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => maltekstseksjon));
          dispatch(
            maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) =>
              draft.map((v) => {
                if (v.versionId === maltekstseksjon.versionId) {
                  return maltekstseksjon;
                }

                if (v.published) {
                  return { ...v, published: false };
                }

                return v;
              }),
            ),
          );

          for (const text of publishedTexts) {
            for (const language of LANGUAGES) {
              dispatch(
                consumerTextsApi.util.updateQueryData('getConsumerTextById', { textId: text.id, language }, () => ({
                  ...text,
                  richText: text.richText[language] ?? getFallbackContent(language, text.richText),
                  language,
                })),
              );
            }

            dispatch(textsQuerySlice.util.updateQueryData('getTextById', text.id, () => text));
            dispatch(
              textsQuerySlice.util.updateQueryData('getTextVersions', text.id, (versionsDraft) =>
                versionsDraft.map((v) => {
                  if (v.versionId === text.versionId) {
                    return text;
                  }

                  if (v.published) {
                    return { ...v, published: false };
                  }

                  return v;
                }),
              ),
            );
          }

          dispatch(
            consumerMaltekstseksjonerApi.util.invalidateTags([
              { type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON_TEXTS, id },
              { type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON, id },
            ]),
          );

          dispatch(
            consumerTextsApi.util.invalidateTags([
              ...publishedTexts.map<{ type: ConsumerTextsTagTypes.TEXT; id: string }>((text) => ({
                type: ConsumerTextsTagTypes.TEXT,
                id: text.id,
              })),
            ]),
          );
        } catch (e) {
          console.error(e);

          maltekstseksjonerPatch.undo();

          for (const textPatch of textPatches) {
            textPatch.undo();
          }
        }
      },
    }),
    duplicateVersion: builder.mutation<IDraftMaltekstseksjon, IDuplicateMaltekstseksjonVersionParams>({
      query: ({ id, versionId }) => ({
        method: 'POST',
        url: `/maltekstseksjoner/${id}/duplicate`,
        body: { versionId },
      }),
      onQueryStarted: async ({ query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        toast.success('Duplikat av maltekstseksjon er opprettet.');

        dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) => [data, ...draft]),
        );
        dispatch(maltekstseksjonerQuerySlice.util.upsertQueryData('getMaltekstseksjonVersions', data.id, [data]));
        dispatch(maltekstseksjonerQuerySlice.util.upsertQueryData('getMaltekstseksjon', data.id, data));
      },
    }),
    createDraftFromVersion: builder.mutation<IDraftMaltekstseksjon, ICreateDraftFromMaltekstseksjonVersionParams>({
      query: ({ id, versionId }) => ({
        method: 'POST',
        url: `/maltekstseksjoner/${id}/draft`,
        body: { versionId },
      }),
      onQueryStarted: async ({ id, query }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        toast.success('Nytt utkast til maltekstseksjon opprettet.');
        dispatch(maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => data));

        dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
            draft.filter((t) => t.id !== id),
          ),
        );

        dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) => {
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

        dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) => [
            data,
            ...draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ]),
        );
      },
    }),
    deleteDraftVersion: builder.mutation<void, IDeleteMaltekstDraftParams>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/maltekstseksjoner/${id}/draft`,
      }),
      onQueryStarted: async ({ id, query, title, versions }, { queryFulfilled, dispatch }) => {
        const lastPublishedVersion = getLastPublishedVersion(versions);

        const versionsPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) =>
            draft.filter(({ publishedDateTime }) => publishedDateTime !== null),
          ),
        );

        const listPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) => {
            if (lastPublishedVersion === undefined) {
              return draft.filter((text) => text.id !== id);
            }

            return draft.map((text) => (text.id === id ? lastPublishedVersion : text));
          }),
        );

        const idPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => lastPublishedVersion),
        );

        try {
          await queryFulfilled;

          if (lastPublishedVersion === undefined) {
            toast.success('Maltekstseksjon slettet.');
          }

          toast.success(`Utkast for maltekstseksjon «${title}» ble slettet.`);
        } catch {
          versionsPatchResult.undo();
          listPatchResult.undo();
          idPatchResult.undo();
        }
      },
    }),
    unpublishMaltekstseksjon: builder.mutation<IDraftMaltekstseksjon, IUnpublishMaltekstseksjonParams>({
      query: ({ publishedMaltekstseksjon }) => ({
        method: 'POST',
        url: `/maltekstseksjoner/${publishedMaltekstseksjon.id}/unpublish`,
      }),
      onQueryStarted: async (
        { publishedMaltekstseksjon, query, maltekstseksjonDraft },
        { queryFulfilled, dispatch },
      ) => {
        const { id, title } = publishedMaltekstseksjon;

        const listPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
            draft.map((text) => {
              if (text.id === id) {
                if (maltekstseksjonDraft !== undefined) {
                  return maltekstseksjonDraft;
                }

                if (text.published) {
                  return { ...text, published: false };
                }
              }

              return text;
            }),
          ),
        );

        const idPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, () => maltekstseksjonDraft),
        );

        const versionsPatchResult = dispatch(
          maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) =>
            draft.map((v) => (v.published ? { ...v, published: false } : v)),
          ),
        );

        try {
          await queryFulfilled;
          toast.success(`Maltekstseksjonen «${title}» ble avpublisert.`);
        } catch {
          idPatchResult.undo();
          listPatchResult.undo();
          versionsPatchResult.undo();
        }
      },
    }),
  }),
});

const update = (id: string, upd: Partial<IDraftMaltekstseksjon>, query: IGetMaltekstseksjonParams) => {
  const draftPatchResult = reduxStore.dispatch(
    maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjonVersions', id, (draft) =>
      draft.map((version) => {
        if (version.published || version.publishedDateTime !== null) {
          return version;
        }

        return { ...version, ...upd };
      }),
    ),
  );

  const listPatchResult = reduxStore.dispatch(
    maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjoner', query, (draft) =>
      draft.map((t) => (t.publishedDateTime === null && t.id === id ? { ...t, ...upd } : t)),
    ),
  );

  const idPatchResult = reduxStore.dispatch(
    maltekstseksjonerQuerySlice.util.updateQueryData('getMaltekstseksjon', id, (draft) => {
      if (draft.published || draft.publishedDateTime !== null) {
        return draft;
      }

      return { ...draft, ...upd };
    }),
  );

  return () => {
    draftPatchResult.undo();
    listPatchResult.undo();
    idPatchResult.undo();
  };
};

export const {
  useCreateMaltekstseksjonMutation,
  useUpdateMaltekstTitleMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateTextIdListMutation,
  useCreateDraftFromVersionMutation,
  useDuplicateVersionMutation,
  useDeleteDraftVersionMutation,
  usePublishMutation,
  usePublishWithTextsMutation,
  useUnpublishMaltekstseksjonMutation,
} = maltekstseksjonerMutationSlice;

const getFallbackContent = (language: Language, richTexts: INewRichTextParams['richText']): KabalValue => {
  for (const lang of LANGUAGES) {
    if (lang === language) {
      continue;
    }
    const text = richTexts[lang];

    if (text !== null) {
      return text;
    }
  }

  return [createSimpleParagraph()];
};
