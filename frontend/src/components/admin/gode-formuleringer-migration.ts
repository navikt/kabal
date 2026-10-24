import { DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';
import type { IText, ListText } from '@/types/texts/responses';

export const OLD_TEMPLATE = TemplateIdEnum.OVERSENDELSESBREV;
const NEW_TEMPLATE = TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK;

type ListItem = Pick<ListText, 'id' | 'title' | 'published' | 'publishedDateTime'>;
type Version = Pick<IText, 'versionId' | 'publishedDateTime'>;
type TextWithSections = Pick<IText, 'templateSectionIdList'>;

export interface MigrationApi {
  getVersions: (id: string) => Promise<Version[]>;
  getText: (id: string) => Promise<TextWithSections>;
  createDraft: (params: { id: string; title: string; versionId: string }) => Promise<void>;
  update: (params: { id: string; templateSectionIdList: string[] }) => Promise<void>;
  invalidateCache: () => void;
}

interface MigrationParams {
  api: MigrationApi;
  texts: ListItem[];
  dryRun: boolean;
}

interface MigrationResult {
  created: string[];
  updated: string[];
  alreadyMigrated: string[];
  failed: string[];
}

export const migrateGodeFormuleringer = async ({ api, texts, dryRun }: MigrationParams): Promise<MigrationResult> => {
  console.debug('Starting gode formuleringer migration');

  const published = texts.filter(({ published }) => published);
  const drafts = texts
    .filter(({ published, publishedDateTime }) => !published && publishedDateTime === null)
    .map(({ id }) => id);

  console.debug(`Found ${published.length} published text(s) and ${drafts.length} draft(s).`);

  const creation = await createDraftsFromPublished(api, published, dryRun);

  console.debug(`Created ${creation.created.length} draft(s) from ${published.length} published text(s).`);

  const allDrafts = [...new Set([...drafts, ...creation.toMigrate])];
  console.debug(`Drafts: ${allDrafts.join(', ')}`);

  const migration = await migrateDrafts(api, allDrafts, dryRun);

  const alreadyMigrated = [...creation.alreadyMigrated, ...migration.alreadyMigrated];
  console.debug(`Already migrated ${alreadyMigrated.length} text(s): ${alreadyMigrated.join(', ')}`);

  const failed = [...creation.failed, ...migration.failed];

  if (failed.length > 0) {
    console.error(`Gode formuleringer migration completed with ${failed.length} failure(s):`, failed.join(', '));
  } else {
    console.debug('Gode formuleringer migration completed.');
  }

  return { created: creation.created, updated: migration.updated, alreadyMigrated, failed };
};

const createDraftsFromPublished = async (api: MigrationApi, published: ListItem[], dryRun: boolean) => {
  console.debug(`Creating drafts from ${published.length} published texts`);

  const created: string[] = [];
  const toMigrate: string[] = [];
  const alreadyMigrated: string[] = [];
  const failed: string[] = [];

  for (const { id, title } of published) {
    try {
      console.debug(`Getting versions for published text with title: ${title} (${id})`);
      const versions = await api.getVersions(id);
      console.debug(`Got ${versions.length} versions`);

      if (versions.some(({ publishedDateTime }) => publishedDateTime === null)) {
        console.debug(`Text with title: ${title} (${id}) already has a draft, skipping draft creation`);
        toMigrate.push(id);
        continue;
      }

      const text = await api.getText(id);
      const { mappedSections, sectionsToAdd } = getTemplateSectionsToAdd(text.templateSectionIdList, id);

      if (mappedSections.length === 0) {
        console.debug(
          `Text with id: ${id} has no sections from the old template, skipping draft creation. Sections: `,
          text.templateSectionIdList,
        );
        continue;
      }

      if (sectionsToAdd.length === 0) {
        console.debug(
          `Text with id: ${id} is already migrated, skipping draft creation. Already present:`,
          mappedSections,
        );
        alreadyMigrated.push(id);
        continue;
      }

      const latestVersion = getLatestPublishedVersion(versions);

      if (latestVersion === undefined) {
        console.warn('No published versions found, skipping draft creation');
        continue;
      }

      if (dryRun) {
        console.debug(`Dry run, not creating draft for published text with title: ${title} (${id})`);
        toMigrate.push(id);
        continue;
      }

      await api.createDraft({ id, title, versionId: latestVersion.versionId });
      console.debug(`Successfully created draft for published text with title: ${title} (${id})`);
      created.push(id);
      toMigrate.push(id);
    } catch (error) {
      console.error(`Failed to create draft for published text with title: ${title} (${id})`, error);
      failed.push(id);
    }
  }

  return { created, toMigrate, alreadyMigrated, failed };
};

const migrateDrafts = async (api: MigrationApi, ids: string[], dryRun: boolean) => {
  console.debug(`Migrating ${ids.length} drafts`);

  api.invalidateCache();

  const updated: string[] = [];
  const alreadyMigrated: string[] = [];
  const failed: string[] = [];

  for (const id of ids) {
    try {
      console.debug(`Getting text with id: ${id}`);
      const text = await api.getText(id);
      console.debug('Got text:', text);

      const { templateSectionIdList } = text;

      const { mappedSections, sectionsToAdd } = getTemplateSectionsToAdd(templateSectionIdList, id);

      if (mappedSections.length === 0) {
        console.debug(`Text with id: ${id} has no sections from the old template, nothing to migrate`);
        continue;
      }

      if (sectionsToAdd.length === 0) {
        console.debug(`Text with id: ${id} is already migrated, skipping. Already present:`, mappedSections);
        alreadyMigrated.push(id);
        continue;
      }

      const newList = [...templateSectionIdList, ...sectionsToAdd];
      console.debug('Old list:', templateSectionIdList, 'Sections to add:', sectionsToAdd, 'New list:', newList);

      if (dryRun) {
        console.debug(`Dry run, not updating text with id: ${id}`);
        continue;
      }

      console.debug(`Saving update for text with id: ${id}`);
      await api.update({ id, templateSectionIdList: newList });
      console.debug('Text updated!');
      updated.push(id);
    } catch (error) {
      console.error(`Failed to migrate text with id: ${id}`, error);
      failed.push(id);
    }
  }

  return { updated, alreadyMigrated, failed };
};

const getLatestPublishedVersion = <T extends Pick<IText, 'publishedDateTime'>>(versions: T[]) =>
  versions
    .filter(({ publishedDateTime }) => publishedDateTime !== null)
    .toSorted((a, b) => (a.publishedDateTime ?? '').localeCompare(b.publishedDateTime ?? ''))
    .at(-1);

const mapTemplateSectionIdList = (templateSectionIdList: string[], textId: string): string[] => {
  const mappedTemplateSections: string[] = [];

  for (const templateSection of templateSectionIdList) {
    if (!templateSection.startsWith(OLD_TEMPLATE)) {
      continue;
    }

    const delimiter = templateSection.charAt(OLD_TEMPLATE.length);
    const section = templateSection.slice(OLD_TEMPLATE.length + 1);
    const mappedSection = SECTION_MAP[section];

    if (mappedSection === undefined) {
      console.warn(`No mapping found for section: ${section} (text ${textId}), skipping.`);
      continue;
    }

    mappedTemplateSections.push(NEW_TEMPLATE + delimiter + mappedSection);
  }

  return mappedTemplateSections;
};

const getTemplateSectionsToAdd = (templateSectionIdList: string[], textId: string) => {
  const mappedSections = [...new Set(mapTemplateSectionIdList(templateSectionIdList, textId))];
  const existing = new Set(templateSectionIdList);

  return { mappedSections, sectionsToAdd: mappedSections.filter((section) => !existing.has(section)) };
};

// Which sections from old template that corresponds to new sections in new template
// TODO: Update map when new sections are known
const SECTION_MAP: Partial<Record<string, string>> = {
  [TemplateSections.TILSVARSBREV_TITLE]: TemplateSections.VURDERINGEN,
  [TemplateSections.TILSVARSRETT_V3]: TemplateSections.TILSVARSBREV_TITLE,
  [TemplateSections.GENERELL_INFO]: TemplateSections.TILSVARSRETT_V3,
  [TemplateSections.TITLE]: TemplateSections.GENERELL_INFO,
  [TemplateSections.INTRODUCTION_V2]: TemplateSections.TITLE,
  [TemplateSections.ANFOERSLER]: TemplateSections.INTRODUCTION_V2,
  [TemplateSections.OPPLYSNINGER]: TemplateSections.ANFOERSLER,
  [TemplateSections.VURDERINGEN]: TemplateSections.OPPLYSNINGER,

  [TemplateSections.REGELVERK_TITLE]: TemplateSections.REGELVERK_TITLE,
  [DeprecatedTemplateSections.TILSVARSRETT_V2]: DeprecatedTemplateSections.TILSVARSRETT_V2,
  [DeprecatedTemplateSections.INTRODUCTION_V1]: DeprecatedTemplateSections.INTRODUCTION_V1,
  '*': '*',
};
