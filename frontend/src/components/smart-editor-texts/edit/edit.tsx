import { EditableTitle } from '@app/components/editable-title/editable-title';
import type { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { Footer } from '@app/components/smart-editor-texts/edit/footer';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useMetadataFilters } from '@app/components/smart-editor-texts/hooks/use-metadata-filters';
import { KlageenhetSelect, TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useSetTextTitleMutation,
  useUpdateEnhetIdListMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/texts/mutations';
import { type IGetTextsParams, REGELVERK_TYPE } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
import { Label, useId } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { ModifiedCreatedDateTime } from '../../datetime/datetime';
import { HjemlerSelect } from '../hjemler-select/hjemler-select';
import { useTextQuery } from '../hooks/use-text-query';

interface Props {
  text: IText;
  onDraftDeleted: () => void;
  autofocus?: boolean;
  children: React.ReactNode;
  status: SavedStatusProps;
  onPublish: () => void;
  deleteTranslation?: () => void;
  error?: string;
}

export const Edit = ({ text, onDraftDeleted, children, status, onPublish, deleteTranslation, error }: Props) => {
  const query = useTextQuery();

  const [updateTitle, { isLoading: titleIsLoading }] = useSetTextTitleMutation();

  const { id, created, title, textType } = text;

  const filters = useMetadataFilters(textType);
  const { hasTemplateSectionFilter, hasEnhetFilter, hasUtfallFilter, hasYtelseHjemmelFilter } = filters;

  const hasAnyFilter = hasTemplateSectionFilter || hasEnhetFilter || hasUtfallFilter || hasYtelseHjemmelFilter;

  const [lastEdit] = text.edits;

  const modifiedId = useId();

  return (
    <Container>
      <Header>
        <EditableTitle
          title={title}
          onChange={(t) => updateTitle({ id, query, title: t })}
          label="Tittel"
          isLoading={titleIsLoading}
        />

        <LineContainer>
          <Label size="small" htmlFor={modifiedId}>
            Sist endret:
          </Label>
          <ModifiedCreatedDateTime id={modifiedId} lastEdit={lastEdit} created={created} />
        </LineContainer>

        {hasAnyFilter ? <Filters text={text} query={query} filters={filters} /> : null}
      </Header>

      {children}

      <Footer
        text={text}
        onDraftDeleted={onDraftDeleted}
        status={status}
        onPublish={onPublish}
        deleteTranslation={deleteTranslation}
        error={error}
      />
    </Container>
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
      <LineContainer>
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
      </LineContainer>

      <Tags {...text} />
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
  padding: var(--a-spacing-4);
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
`;
