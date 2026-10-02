import { afterAll, beforeAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { migrateGodeFormuleringer } from '@/components/admin/gode-formuleringer-migration';
import { LIST_DELIMITER } from '@/components/smart-editor-texts/types';
import { TemplateSections } from '@/plate/template-sections';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const OLD = TemplateIdEnum.OVERSENDELSESBREV;
const NEW = TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK;

const PUBLISHED_ID = 'published-text';
const DRAFT_ID = 'draft-text';

const MIGRATED_DRAFT_SECTION = `${NEW}${LIST_DELIMITER}${TemplateSections.ANFOERSLER}`;
const MIGRATED_PUBLISHED_SECTION = `${NEW}${LIST_DELIMITER}${TemplateSections.INTRODUCTION_V2}`;

const TEXT_LIST = [
  { id: PUBLISHED_ID, title: 'Published text', published: true, publishedDateTime: '2026-03-01T10:00:00' },
  { id: DRAFT_ID, title: 'Draft text', published: false, publishedDateTime: null },
];

type Versions = Record<string, { versionId: string; publishedDateTime: string | null }[]>;
type Texts = Record<string, { templateSectionIdList: string[] }>;

const createVersions = (): Versions => ({
  [PUBLISHED_ID]: [
    { versionId: 'newest-version', publishedDateTime: '2026-03-01T10:00:00' },
    { versionId: 'oldest-version', publishedDateTime: '2026-01-01T10:00:00' },
  ],
});

const createTexts = (): Texts => ({
  [PUBLISHED_ID]: {
    templateSectionIdList: [
      `${OLD}${LIST_DELIMITER}${TemplateSections.ANFOERSLER}`,
      `${OLD}${LIST_DELIMITER}unknown-section`,
      `other-template${LIST_DELIMITER}${TemplateSections.TITLE}`,
    ],
  },
  [DRAFT_ID]: {
    templateSectionIdList: [`${OLD}${LIST_DELIMITER}${TemplateSections.OPPLYSNINGER}`],
  },
});

// An in-memory backend: creating a draft adds a draft version, updating replaces the text's sections.
const createBackend = (initial: { versions?: Versions; texts?: Texts } = {}) => {
  const versions = initial.versions ?? createVersions();
  const texts = initial.texts ?? createTexts();
  const events: string[] = [];

  const api = {
    getVersions: mock(async (id: string) => versions[id] ?? []),
    getText: mock(async (id: string) => {
      const text = texts[id];

      if (text === undefined) {
        throw new Error(`Unknown text: ${id}`);
      }

      return text;
    }),
    createDraft: mock(async ({ id }: { id: string; title: string; versionId: string }) => {
      versions[id] = [{ versionId: 'draft-version', publishedDateTime: null }, ...(versions[id] ?? [])];
    }),
    update: mock(async ({ id, templateSectionIdList }: { id: string; templateSectionIdList: string[] }) => {
      events.push(`update:${id}`);
      texts[id] = { templateSectionIdList };
    }),
    invalidateCache: mock(() => {
      events.push('invalidateCache');
    }),
  };

  return { api, texts, versions, events };
};

describe('migrateGodeFormuleringer', () => {
  const spies = [spyOn(console, 'debug'), spyOn(console, 'warn'), spyOn(console, 'error')];

  beforeAll(() => {
    for (const spy of spies) {
      spy.mockImplementation(() => undefined);
    }
  });

  beforeEach(() => {
    for (const spy of spies) {
      spy.mockClear();
    }
  });

  afterAll(() => {
    for (const spy of spies) {
      spy.mockRestore();
    }
  });

  it('creates drafts from published texts, then maps sections for all drafts', async () => {
    const { api } = createBackend();

    const result = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

    // Only published texts get a new draft, based on the newest published version.
    expect(api.getVersions.mock.calls.map(([id]) => id)).toEqual([PUBLISHED_ID]);
    expect(api.createDraft).toHaveBeenCalledTimes(1);
    expect(api.createDraft).toHaveBeenCalledWith({
      id: PUBLISHED_ID,
      title: 'Published text',
      versionId: 'newest-version',
    });

    // Published texts are checked before a draft is created. Then existing drafts are migrated first.
    expect(api.getText.mock.calls.map(([id]) => id)).toEqual([PUBLISHED_ID, DRAFT_ID, PUBLISHED_ID]);

    // The delimiter from the old template id is reused.
    expect(api.update).toHaveBeenNthCalledWith(1, {
      id: DRAFT_ID,
      templateSectionIdList: [`${OLD}${LIST_DELIMITER}${TemplateSections.OPPLYSNINGER}`, MIGRATED_DRAFT_SECTION],
    });

    // Unmapped sections and sections from other templates are kept as-is, but not mapped.
    expect(api.update).toHaveBeenNthCalledWith(2, {
      id: PUBLISHED_ID,
      templateSectionIdList: [
        `${OLD}${LIST_DELIMITER}${TemplateSections.ANFOERSLER}`,
        `${OLD}${LIST_DELIMITER}unknown-section`,
        `other-template${LIST_DELIMITER}${TemplateSections.TITLE}`,
        MIGRATED_PUBLISHED_SECTION,
      ],
    });

    expect(result).toEqual({
      created: [PUBLISHED_ID],
      updated: [DRAFT_ID, PUBLISHED_ID],
      alreadyMigrated: [],
      failed: [],
    });
  });

  it('continues with the remaining texts when one fails, and reports the failure', async () => {
    const { api } = createBackend();
    api.getText.mockImplementation(async (id) => {
      if (id === DRAFT_ID) {
        throw new Error('Network error');
      }

      return createTexts()[id] ?? { templateSectionIdList: [] };
    });

    const result = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

    expect(result.failed).toEqual([DRAFT_ID]);
    expect(api.update).toHaveBeenCalledTimes(1);
    expect(api.update).toHaveBeenCalledWith(expect.objectContaining({ id: PUBLISHED_ID }));
  });

  it('continues with the other texts when draft creation fails', async () => {
    const { api } = createBackend();
    api.createDraft.mockRejectedValueOnce(new Error('Conflict'));

    const result = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

    expect(result.failed).toEqual([PUBLISHED_ID]);
    expect(result.created).toEqual([]);
    expect(api.update).toHaveBeenCalledTimes(1);
    expect(api.update).toHaveBeenCalledWith(expect.objectContaining({ id: DRAFT_ID }));
  });

  it('creates no drafts and updates nothing in dry run', async () => {
    const { api } = createBackend();

    const result = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: true });

    expect(api.createDraft).not.toHaveBeenCalled();
    expect(api.update).not.toHaveBeenCalled();
    expect(result).toEqual({ created: [], updated: [], alreadyMigrated: [], failed: [] });
  });

  describe('idempotency', () => {
    it('gives the same result when run twice as when run once', async () => {
      const { api, texts } = createBackend();

      await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

      const textsAfterFirstRun = structuredClone(texts);

      // TEXT_LIST is stale on purpose: it still says the published text has no draft.
      const secondRun = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

      expect(texts).toEqual(textsAfterFirstRun);
      expect(api.update).toHaveBeenCalledTimes(2);
      expect(api.createDraft).toHaveBeenCalledTimes(1);
      expect(secondRun).toEqual({
        created: [],
        updated: [],
        alreadyMigrated: [DRAFT_ID, PUBLISHED_ID],
        failed: [],
      });
    });

    it('skips texts that are already migrated, without creating drafts', async () => {
      const { api } = createBackend({
        texts: {
          [PUBLISHED_ID]: {
            templateSectionIdList: [
              `${OLD}${LIST_DELIMITER}${TemplateSections.ANFOERSLER}`,
              MIGRATED_PUBLISHED_SECTION,
            ],
          },
          [DRAFT_ID]: {
            templateSectionIdList: [`${OLD}${LIST_DELIMITER}${TemplateSections.OPPLYSNINGER}`, MIGRATED_DRAFT_SECTION],
          },
        },
      });

      const result = await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

      expect(api.createDraft).not.toHaveBeenCalled();
      expect(api.update).not.toHaveBeenCalled();
      expect(result.alreadyMigrated).toEqual([PUBLISHED_ID, DRAFT_ID]);
    });

    it('does not create a draft when none of the old sections can be mapped', async () => {
      const { api } = createBackend({
        texts: {
          ...createTexts(),
          [PUBLISHED_ID]: { templateSectionIdList: [`${OLD}${LIST_DELIMITER}unknown-section`] },
        },
      });

      await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

      expect(api.createDraft).not.toHaveBeenCalled();
      expect(api.update).not.toHaveBeenCalledWith(expect.objectContaining({ id: PUBLISHED_ID }));
    });

    it('does not create a new draft for a published text that already has one', async () => {
      const { api } = createBackend({
        versions: {
          [PUBLISHED_ID]: [
            { versionId: 'existing-draft', publishedDateTime: null },
            ...(createVersions()[PUBLISHED_ID] ?? []),
          ],
        },
      });

      await migrateGodeFormuleringer({ api, texts: TEXT_LIST, dryRun: false });

      expect(api.createDraft).not.toHaveBeenCalled();
      expect(api.update).toHaveBeenCalledWith(expect.objectContaining({ id: PUBLISHED_ID }));
    });
  });
});
