import React from 'react';
import { styled } from 'styled-components';
import { EditableTitle } from '@app/components/editable-title/editable-title';
import { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { Footer } from '@app/components/smart-editor-texts/edit/footer';
import { TagContainer, TagList } from '@app/components/smart-editor-texts/edit/tags';
import { useKlageenheterOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { KlageenhetSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { useEnhetNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { useSetTextTitleMutation, useUpdateEnhetIdListMutation } from '@app/redux-api/texts/mutations';
import { PlainTextTypes } from '@app/types/common-text-types';
import { DraftPlainTextVersion, DraftRichTextVersion } from '@app/types/texts/responses';
import { ModifiedCreatedDateTime } from '../../datetime/datetime';
import { useTextQuery } from '../hooks/use-text-query';

interface Props {
  text: DraftPlainTextVersion | DraftRichTextVersion;
  onDraftDeleted: () => void;
  autofocus?: boolean;
  children: React.ReactNode;
  status: SavedStatusProps;
  onPublish: () => void;
}

export const Edit = ({ text, onDraftDeleted, children, status, onPublish }: Props) => {
  const query = useTextQuery();

  const [updateTitle, { isLoading: titleIsLoading }] = useSetTextTitleMutation();

  const [updateEnhetIdList] = useUpdateEnhetIdListMutation();

  const { id, modified, created, enhetIdList, title, textType } = text;

  const klageenheterOptions = useKlageenheterOptions();

  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;

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
        <TagContainer>
          <TagList
            variant="enhetIdList"
            noneLabel="Alle enheter"
            ids={enhetIdList}
            useName={useEnhetNameFromIdOrLoading}
          />
        </TagContainer>
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
