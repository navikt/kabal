import React from 'react';
import { styled } from 'styled-components';
import { EditableTitle } from '@app/components/editable-title/editable-title';
import { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { Footer } from '@app/components/smart-editor-texts/edit/footer';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useKlageenheterOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { KlageenhetSelect, TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useSetTextTitleMutation,
  useUpdateEnhetIdListMutation,
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/texts/mutations';
import { PlainTextTypes, RichTextTypes } from '@app/types/common-text-types';
import { IText } from '@app/types/texts/responses';
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
}

export const Edit = ({ text, onDraftDeleted, children, status, onPublish }: Props) => {
  const query = useTextQuery();

  const [updateTitle, { isLoading: titleIsLoading }] = useSetTextTitleMutation();

  const [updateTemplateSectionIdList] = useUpdateTemplateSectionIdListMutation();
  const [updateYtelseHjemmelIdList] = useUpdateYtelseHjemmelIdListMutation();
  const [updateUtfallIdList] = useUpdateUtfallIdListMutation();
  const [updateEnhetIdList] = useUpdateEnhetIdListMutation();

  const {
    id,
    modified,
    created,
    ytelseHjemmelIdList,
    utfallIdList,
    enhetIdList,
    templateSectionIdList,
    title,
    textType,
  } = text;

  const klageenheterOptions = useKlageenheterOptions();

  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;
  const hasFixedLocation = isHeaderFooter || textType === RichTextTypes.REGELVERK;

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
          <ModifiedCreatedDateTime modified={modified} created={created} />
        </LineContainer>

        <LineContainer>
          {hasFixedLocation ? null : (
            <TemplateSectionSelect
              selected={templateSectionIdList}
              onChange={(v) => updateTemplateSectionIdList({ id, query, templateSectionIdList: v })}
              textType={textType}
              templatesSelectable={textType === RichTextTypes.GOD_FORMULERING}
            >
              Maler og seksjoner
            </TemplateSectionSelect>
          )}

          {isHeaderFooter ? null : (
            <HjemlerSelect
              selected={ytelseHjemmelIdList}
              onChange={(value) => updateYtelseHjemmelIdList({ id, query, ytelseHjemmelIdList: value })}
              ytelserSelectable={textType !== RichTextTypes.REGELVERK}
            />
          )}

          {isHeaderFooter ? null : (
            <UtfallSetFilter
              selected={utfallIdList}
              onChange={(value) => updateUtfallIdList({ id, query, utfallIdList: value })}
            />
          )}

          {isHeaderFooter ? (
            <KlageenhetSelect
              selected={enhetIdList ?? []}
              onChange={(value) => updateEnhetIdList({ id, query, enhetIdList: value })}
              options={klageenheterOptions}
            >
              Enheter
            </KlageenhetSelect>
          ) : null}
        </LineContainer>

        <Tags {...text} />
      </Header>

      {children}

      <Footer text={text} onDraftDeleted={onDraftDeleted} status={status} onPublish={onPublish} />
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
  row-gap: 8px;
  padding: 16px;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
