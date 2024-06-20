import { describe, expect, it } from 'bun:test';
import { getLastPublishedAndVersionToShowInTrash } from '@app/redux-api/redaktoer-helpers';
import { IText } from '@app/types/texts/responses';

const createIText = (published: boolean, publishedDateTime: string | null): IText =>
  ({
    published,
    publishedDateTime,
  }) as IText;

describe('getLastPublishedAndVersionToShowInTrash', () => {
  it('should should ignore draft', () => {
    expect.assertions(1);

    const draft = createIText(false, null);
    const actualLastPublished = createIText(true, '2023-01-01');

    const versions = [draft, actualLastPublished];

    const [lastPublishedVersion] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBe(actualLastPublished);
  });

  it('should not return version to show in trash if there is a published version', () => {
    expect.assertions(2);

    const draft = createIText(false, null);
    const actualLastPublished = createIText(true, '2023-01-01');
    const actualVersionToShowInTrash = createIText(false, '2022-01-01');

    const versions = [draft, actualLastPublished, actualVersionToShowInTrash];

    const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBe(actualLastPublished);
    expect(versionToShowInTrash).toBeUndefined();
  });

  it('should return version to show in trash if there is not a published version', () => {
    expect.assertions(2);

    const draft = createIText(false, null);
    const actualVersionToShowInTrash = createIText(false, '2022-01-01');

    const versions = [draft, actualVersionToShowInTrash];

    const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBeUndefined();
    expect(versionToShowInTrash).toBe(actualVersionToShowInTrash);
  });

  it('should return first available unpublished version, even in not-sorted array', () => {
    expect.assertions(2);

    const draft = createIText(false, null);
    const unpublished1 = createIText(false, '2021-01-01');
    const actualVersionToShowInTrash = createIText(false, '2022-01-01');
    const unpublished2 = createIText(false, '2020-01-01');

    const versions = [draft, unpublished1, actualVersionToShowInTrash, unpublished2];

    const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBeUndefined();
    expect(versionToShowInTrash).toBe(actualVersionToShowInTrash);
  });

  it('should work with a weird array where published version comes after unpublished', () => {
    expect.assertions(2);

    const draft = createIText(false, null);
    const actualVersionToShowInTrash = createIText(false, '2022-01-01');
    const actualLastPublished = createIText(true, '2023-01-01');
    const unpublished = createIText(false, '2021-01-01');

    const versions = [draft, actualVersionToShowInTrash, actualLastPublished, unpublished];

    const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBe(actualLastPublished);
    expect(versionToShowInTrash).toBeUndefined();
  });

  it('should work with a weird array where draft is not first', () => {
    expect.assertions(2);

    const actualVersionToShowInTrash = createIText(false, '2022-01-01');
    const draft = createIText(false, null);
    const actualLastPublished = createIText(true, '2023-01-01');
    const unpublished = createIText(false, '2021-01-01');

    const versions = [actualVersionToShowInTrash, draft, actualLastPublished, unpublished];

    const [lastPublishedVersion, versionToShowInTrash] = getLastPublishedAndVersionToShowInTrash(versions);

    expect(lastPublishedVersion).toBe(actualLastPublished);
    expect(versionToShowInTrash).toBeUndefined();
  });
});
