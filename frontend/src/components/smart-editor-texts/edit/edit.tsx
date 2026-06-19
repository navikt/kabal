import { HStack, VStack } from '@navikt/ds-react';
import { EditableTitle } from '@/components/editable-title/editable-title';
import { AllMaltekstseksjonReferences } from '@/components/malteksteksjon-references/maltekstseksjon-references';
import { TextDraftActions } from '@/components/smart-editor-texts/edit/draft-actions';
import { Tags } from '@/components/smart-editor-texts/edit/tags';
import { useMetadataFilters } from '@/components/smart-editor-texts/hooks/use-metadata-filters';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import { TextModified } from '@/components/smart-editor-texts/modified';
import { TemplateSectionFilter } from '@/components/smart-editor-texts/query-filter-selects';
import { RegistreringshjemlerSelect } from '@/components/smart-editor-texts/registreringshjemler-select/registreringshjemler-select';
import { YtelserAndRegistreringshjemlerSelect } from '@/components/smart-editor-texts/registreringshjemler-select/ytelser-and-registreringshjemler-select';
import { UtfallSetFilter } from '@/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useSetTextTitleMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@/redux-api/texts/mutations';
import { type IGetTextsParams, REGELVERK_TYPE } from '@/types/common-text-types';
import type { IText } from '@/types/texts/responses';

interface Props {
  text: IText;
  onDraftDeleted: () => void;
  autofocus?: boolean;
  children: React.ReactNode;
  onPublish: () => void;
  deleteTranslation?: () => void;
  error?: string;
}

export const Edit = ({ text, onDraftDeleted, children, onPublish, deleteTranslation, error }: Props) => {
  const query = useTextQuery();

  const [updateTitle, { isLoading: titleIsLoading }] = useSetTextTitleMutation();

  const { id, title, textType, draftMaltekstseksjonIdList, publishedMaltekstseksjonIdList } = text;

  const filters = useMetadataFilters(textType);
  const { hasTemplateSectionFilter, hasUtfallFilter, hasYtelseHjemmelFilter } = filters;

  const hasAnyFilter = hasTemplateSectionFilter || hasUtfallFilter || hasYtelseHjemmelFilter;

  return (
    <VStack height="100%">
      <VStack gap="space-8" paddingBlock="space-16" paddingInline="space-16">
        <EditableTitle
          title={title}
          onChange={(t) => updateTitle({ id, query, title: t })}
          label="Tittel"
          isLoading={titleIsLoading}
        />

        <TextModified {...text} />

        {hasAnyFilter ? <Filters text={text} query={query} filters={filters} /> : null}

        <HStack gap="space-8" align="center" justify="space-between">
          <AllMaltekstseksjonReferences
            textType={textType}
            currentMaltekstseksjonId={id}
            draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
            publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
          />
          <TextDraftActions
            text={text}
            onDraftDeleted={onDraftDeleted}
            onPublish={onPublish}
            deleteTranslation={deleteTranslation}
            error={error}
          />
        </HStack>
      </VStack>

      {children}
    </VStack>
  );
};

interface FiltersProps {
  query: IGetTextsParams;
  text: IText;
  filters: ReturnType<typeof useMetadataFilters>;
}

const Filters = ({ text, query, filters }: FiltersProps) => {
  const [updateTemplateSectionIdList] = useUpdateTemplateSectionIdListMutation();
  const [updateYtelseHjemmelIdList] = useUpdateYtelseHjemmelIdListMutation();
  const [updateUtfallIdList] = useUpdateUtfallIdListMutation();

  const { id, ytelseHjemmelIdList, utfallIdList, templateSectionIdList, textType } = text;

  const { hasTemplateSectionFilter, hasUtfallFilter, hasYtelseHjemmelFilter } = filters;

  return (
    <>
      <HStack gap="space-8" align="center">
        {hasTemplateSectionFilter ? (
          <TemplateSectionFilter
            selected={templateSectionIdList}
            onChange={(v) => updateTemplateSectionIdList({ id, query, templateSectionIdList: v })}
            includeDeprecated
          />
        ) : null}

        {hasYtelseHjemmelFilter ? (
          textType === REGELVERK_TYPE ? (
            <RegistreringshjemlerSelect
              selected={ytelseHjemmelIdList}
              onChange={(value) => updateYtelseHjemmelIdList({ id, query, ytelseHjemmelIdList: value })}
            />
          ) : (
            <YtelserAndRegistreringshjemlerSelect
              selected={ytelseHjemmelIdList}
              onChange={(value) => updateYtelseHjemmelIdList({ id, query, ytelseHjemmelIdList: value })}
            />
          )
        ) : null}

        {hasUtfallFilter ? (
          <UtfallSetFilter
            selected={utfallIdList}
            onChange={(value) => updateUtfallIdList({ id, query, utfallIdList: value })}
          />
        ) : null}
      </HStack>

      <Tags {...text} />
    </>
  );
};
