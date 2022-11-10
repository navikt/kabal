import { useLazyMigrateGetAllTextsQuery, useMigrateUpdateTextsMutation } from '../../redux-api/texts';
import { RichText_Latest_Text } from '../../types/rich-text/latest';
import { VersionedText } from '../../types/rich-text/versions';
import { IUpdateText } from '../../types/texts/texts';
import { migrateFromV0ToV1 } from '../rich-text/migrations/v0';
import { migrateFromV1ToV2 } from '../rich-text/migrations/v1';
import { migrateFromV2ToV3 } from '../rich-text/migrations/v2';
import { VERSION } from '../rich-text/version';
import { ApiHook } from './types';

export const useMigrateTexts: ApiHook = () => {
  const [getAllTexts, { isLoading: getIsLoading, isSuccess: getIsSuccess, isUninitialized: getIsUninitialized }] =
    useLazyMigrateGetAllTextsQuery();
  const [
    updateTexts,
    { isLoading: updateIsLoading, isSuccess: updateIsSuccess, isUninitialized: updateIsUninitialized },
  ] = useMigrateUpdateTextsMutation();

  const execute = async () => {
    const texts = await getAllTexts(undefined, false).unwrap();
    const migratedTexts: IUpdateText[] = texts.map(migrate);
    await updateTexts(migratedTexts);
  };

  return [
    execute,
    {
      isLoading: getIsLoading || updateIsLoading,
      isSuccess: getIsSuccess && updateIsSuccess,
      isUninitialized: getIsUninitialized || updateIsUninitialized,
    },
  ];
};

const migrate = (text: VersionedText): RichText_Latest_Text => {
  if (text.version === VERSION) {
    return text;
  }

  if (text.version === undefined || text.version === 0) {
    return migrate({ ...text, ...migrateFromV0ToV1(text) });
  }

  if (text.version === 1) {
    return migrate({ ...text, ...migrateFromV1ToV2(text) });
  }

  if (text.version === 2) {
    return migrate({ ...text, ...migrateFromV2ToV3(text) });
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unable to migrate from version ${text.version ?? 0} to version ${VERSION}`);
};
