import { EditableTitle } from '@app/components/editable-title/editable-title';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { Changelog } from '@app/components/smart-editor-texts/edit/changelog';
import { TextDraftActions } from '@app/components/smart-editor-texts/edit/draft-actions';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useMetadataFilters } from '@app/components/smart-editor-texts/hooks/use-metadata-filters';
import { KlageenhetSelect, TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import { isPlainText } from '@app/functions/is-rich-plain-text';
import {
  useSetTextTitleMutation,
  useUpdateEnhetIdListMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { type IGetTextsParams, REGELVERK_TYPE } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
import { HStack, Label, VStack, useId } from '@navikt/ds-react';
import { ModifiedCreatedDateTime } from '../../datetime/datetime';
import { HjemlerSelect } from '../hjemler-select/hjemler-select';
import { useTextQuery } from '../hooks/use-text-query';

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

  const { id, created, title, textType, draftMaltekstseksjonIdList, publishedMaltekstseksjonIdList } = text;

  const { data: versions = [] } = useGetTextVersionsQuery(id);

  const filters = useMetadataFilters(textType);
  const { hasTemplateSectionFilter, hasEnhetFilter, hasUtfallFilter, hasYtelseHjemmelFilter } = filters;

  const hasAnyFilter = hasTemplateSectionFilter || hasEnhetFilter || hasUtfallFilter || hasYtelseHjemmelFilter;

  const [lastEdit] = text.edits;

  const modifiedId = useId();

  return (
    <VStack height="100%">
      <VStack gap="2" paddingBlock="4" paddingInline="4">
        <EditableTitle
          title={title}
          onChange={(t) => updateTitle({ id, query, title: t })}
          label="Tittel"
          isLoading={titleIsLoading}
        />

        <HStack gap="2" align="center">
          <Label size="small" htmlFor={modifiedId}>
            Sist endret:
          </Label>
          <ModifiedCreatedDateTime id={modifiedId} lastEdit={lastEdit} created={created} />
          <Changelog versions={versions} />
        </HStack>

        {hasAnyFilter ? <Filters text={text} query={query} filters={filters} /> : null}

        <HStack gap="2" align="center" justify="space-between">
          {isPlainText(text) ? null : (
            <AllMaltekstseksjonReferences
              textType={textType}
              currentMaltekstseksjonId={id}
              draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
              publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
            />
          )}
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
  const [updateEnhetIdList] = useUpdateEnhetIdListMutation();

  const { id, ytelseHjemmelIdList, utfallIdList, enhetIdList, templateSectionIdList, textType } = text;

  const { hasTemplateSectionFilter, hasEnhetFilter, hasUtfallFilter, hasYtelseHjemmelFilter } = filters;

  return (
    <>
      <HStack gap="2" align="center">
        {hasTemplateSectionFilter ? (
          <TemplateSectionSelect
            selected={templateSectionIdList}
            onChange={(v) => updateTemplateSectionIdList({ id, query, templateSectionIdList: v })}
            templatesSelectable
          >
            Maler og seksjoner
          </TemplateSectionSelect>
        ) : null}

        {hasYtelseHjemmelFilter ? (
          <HjemlerSelect
            selected={ytelseHjemmelIdList}
            onChange={(value) => updateYtelseHjemmelIdList({ id, query, ytelseHjemmelIdList: value })}
            ytelserSelectable={textType !== REGELVERK_TYPE}
          />
        ) : null}

        {hasUtfallFilter ? (
          <UtfallSetFilter
            selected={utfallIdList}
            onChange={(value) => updateUtfallIdList({ id, query, utfallIdList: value })}
          />
        ) : null}

        {hasEnhetFilter ? (
          <KlageenhetSelect
            selected={enhetIdList ?? []}
            onChange={(value) => updateEnhetIdList({ id, query, enhetIdList: value })}
          >
            Enheter
          </KlageenhetSelect>
        ) : null}
      </HStack>

      <Tags {...text} />
    </>
  );
};
