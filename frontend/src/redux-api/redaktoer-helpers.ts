import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IText } from '@app/types/texts/responses';

export const getLastPublishedAndVersionToShowInTrash = <T extends IText | IMaltekstseksjon>(
  versions: T[],
): [T | undefined, T | undefined] => {
  let lastPublishedVersion: T | undefined = undefined;
  let versionToShowInTrash: T | undefined = undefined;

  for (const version of versions) {
    if (version.published) {
      lastPublishedVersion = version;
    }

    if (lastPublishedVersion !== undefined) {
      // If there is a published version then there is nothing to show in trash
      versionToShowInTrash = undefined;
      break;
    }

    if (version.publishedDateTime !== null) {
      if (
        versionToShowInTrash === undefined ||
        versionToShowInTrash.publishedDateTime === null ||
        version.publishedDateTime > versionToShowInTrash.publishedDateTime
      ) {
        versionToShowInTrash = version;
      }
    }
  }

  return [lastPublishedVersion, versionToShowInTrash];
};
