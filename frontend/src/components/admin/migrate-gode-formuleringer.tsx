import { Button } from '@navikt/ds-react';
import {
  type MigrationApi,
  migrateGodeFormuleringer,
  OLD_TEMPLATE,
} from '@/components/admin/gode-formuleringer-migration';
import { LIST_DELIMITER, WILDCARD } from '@/components/smart-editor-texts/types';
import { toast } from '@/components/toast/store';
import { useAppDispatch } from '@/redux/configure-store';
import { useCreateDraftFromVersionMutation, useUpdateTemplateSectionIdListMutation } from '@/redux-api/texts/mutations';
import { useGetTextsQuery, useLazyGetTextByIdQuery, useLazyGetTextVersionsQuery } from '@/redux-api/texts/queries';
import { TextsTagTypes, textsApi } from '@/redux-api/texts/texts';
import { GOD_FORMULERING_TYPE, type IGetTextsParams } from '@/types/common-text-types';

const QUERY: IGetTextsParams = {
  textType: GOD_FORMULERING_TYPE,
  templateSectionIdList: [`${OLD_TEMPLATE}${LIST_DELIMITER}${WILDCARD}`],
};

// Default for the dryRun prop. Set to false to actually update the texts.
const DRY_RUN: boolean = true;

interface Props {
  dryRun?: boolean;
}

// https://nav-it.slack.com/archives/G01CTUC8LSU/p1790932140846479
export const MigrateGodeFormuleringer = ({ dryRun = DRY_RUN }: Props) => {
  const dispatch = useAppDispatch();
  const { data = [], isFetching: isLoadingTexts } = useGetTextsQuery(QUERY);
  const [createDraft, { isLoading: isCreatingDraft }] = useCreateDraftFromVersionMutation();
  const [getVersions, { isFetching: isLoadingVersions }] = useLazyGetTextVersionsQuery();
  const [getTextById, { isFetching: isLoadingText }] = useLazyGetTextByIdQuery();
  const [update, { isLoading: isUpdating }] = useUpdateTemplateSectionIdListMutation();

  const api: MigrationApi = {
    getVersions: (id) => getVersions(id).unwrap(),
    getText: (id) => getTextById(id).unwrap(),
    createDraft: async (params) => {
      await createDraft({ ...params, query: QUERY }).unwrap();
    },
    update: async (params) => {
      await update({ ...params, query: QUERY }).unwrap();
    },
    invalidateCache: () => {
      dispatch(textsApi.util.invalidateTags([TextsTagTypes.TEXT, TextsTagTypes.TEXT_VERSIONS]));
    },
  };

  const onClick = async () => {
    const { failed } = await migrateGodeFormuleringer({ api, texts: data, dryRun });

    if (failed.length > 0) {
      toast.error(`Migrering ferdig med ${failed.length} feil. Se konsoll for detaljer.`);

      return;
    }

    toast.success('Migrering ferdig uten feil.');
  };

  const isLoading = isLoadingTexts || isCreatingDraft || isLoadingVersions || isLoadingText || isUpdating;

  return (
    <Button size="small" onClick={onClick} loading={isLoading}>
      Migrate gode formuleringer
    </Button>
  );
};
