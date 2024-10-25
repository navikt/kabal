import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IText } from '@app/types/texts/responses';

export const getLastPublishedVersion = <T extends IText | IMaltekstseksjon>(versions: T[]): T | undefined => {
  type Published = T & { publishedDateTime: string };

  const isPublished = (version: T): version is Published => version.publishedDateTime !== null;

  let newest: Published | undefined = undefined;

  for (const version of versions) {
    if (!isPublished(version)) {
      continue;
    }

    if (newest === undefined || version.publishedDateTime > newest.publishedDateTime) {
      newest = version;
    }
  }

  return newest;
};
