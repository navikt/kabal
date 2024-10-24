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
import { GOD_FORMULERING_TYPE, REGELVERK_TYPE, TextChangeType } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
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

  const [updateTemplateSectionIdList] = useUpdateTemplateSectionIdListMutation();
  const [updateYtelseHjemmelIdList] = useUpdateYtelseHjemmelIdListMutation();
  const [updateUtfallIdList] = useUpdateUtfallIdListMutation();
  const [updateEnhetIdList] = useUpdateEnhetIdListMutation();

  const { id, created, ytelseHjemmelIdList, utfallIdList, enhetIdList, templateSectionIdList, title, textType } = text;

  const { enhet, templateSection, utfall, ytelseHjemmel } = useMetadataFilters(textType);

  const [lastEdit] = text.edits.filter(
    (e) =>
      e.changeType === TextChangeType.TEXT_ENHETER ||
      e.changeType === TextChangeType.TEXT_SECTIONS ||
      e.changeType === TextChangeType.TEXT_YTELSE_HJEMMEL ||
      e.changeType === TextChangeType.TEXT_UTFALL ||
      e.changeType === TextChangeType.TEXT_TITLE ||
      e.changeType === TextChangeType.TEXT_VERSION_CREATED ||
      e.changeType === TextChangeType.TEXT_TYPE ||
      e.changeType === TextChangeType.SMART_EDITOR_VERSION,
  );

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
          <strong>Sist endret:</strong>
          <ModifiedCreatedDateTime lastEdit={lastEdit} created={created} />
        </LineContainer>

        <LineContainer>
          {templateSection ? (
            <TemplateSectionSelect
              selected={templateSectionIdList}
              onChange={(v) => updateTemplateSectionIdList({ id, query, templateSectionIdList: v })}
              textType={textType}
              templatesSelectable={textType === GOD_FORMULERING_TYPE}
            >
              Maler og seksjoner
            </TemplateSectionSelect>
          ) : null}

          {ytelseHjemmel ? (
            <HjemlerSelect
              selected={ytelseHjemmelIdList}
              onChange={(value) => updateYtelseHjemmelIdList({ id, query, ytelseHjemmelIdList: value })}
              ytelserSelectable={textType !== REGELVERK_TYPE}
            />
          ) : null}

          {utfall ? (
            <UtfallSetFilter
              selected={utfallIdList}
              onChange={(value) => updateUtfallIdList({ id, query, utfallIdList: value })}
            />
          ) : null}

          {enhet ? (
            <KlageenhetSelect
              selected={enhetIdList ?? []}
              onChange={(value) => updateEnhetIdList({ id, query, enhetIdList: value })}
            >
              Enheter
            </KlageenhetSelect>
          ) : null}
        </LineContainer>

        <Tags {...text} />
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
