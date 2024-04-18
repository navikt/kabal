import { UploadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { SavedStatus, SavedStatusProps } from '@app/components/saved-status/saved-status';
import { isoDateTimeToPretty } from '@app/domain/date';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { IEditor } from '@app/types/common-text-types';
import { isLanguage } from '@app/types/texts/language';
import { DraftPlainTextContent, DraftRichTextVersion } from '@app/types/texts/responses';
import { DeleteDraftButton } from '../delete-draft-button';

interface Props {
  text: DraftPlainTextContent | DraftRichTextVersion;
  onDraftDeleted: () => void;
  status: SavedStatusProps;
  onPublish: () => void;
}

export const Footer = ({ text, onDraftDeleted, status, onPublish }: Props) => {
  const { id, editors, publishedMaltekstseksjonIdList, draftMaltekstseksjonIdList, publishedDateTime, title } = text;
  const [, { isLoading: publishIsLoading }] = usePublishMutation({ fixedCacheKey: id });
  const { lang } = useParams();
  const { data: versions = [] } = useGetTextVersionsQuery(isLanguage(lang) ? { id, language: lang } : skipToken);

  const isDraft = publishedDateTime === null;

  return (
    <Container>
      <Left>
        <Button onClick={onPublish} icon={<UploadIcon aria-hidden />} size="small" loading={publishIsLoading}>
          Publiser
        </Button>
        {isDraft ? (
          <DeleteDraftButton id={id} title={title} onDraftDeleted={onDraftDeleted}>
            {`Slett ${versions.length <= 1 ? 'tekst' : 'utkast'}`}
          </DeleteDraftButton>
        ) : null}
      </Left>

      <Right>
        <AllMaltekstseksjonReferences
          currentMaltekstseksjonId={id}
          draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
          publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
        />

        <SavedStatus {...status} />
        <LastEditor editors={editors} />
      </Right>
    </Container>
  );
};

const LastEditor = ({ editors }: { editors: IEditor[] }) => {
  const [lastEdit] = editors;

  if (lastEdit === undefined) {
    return null;
  }

  return (
    <LastEditorContainer>
      Sist endret: <time dateTime={lastEdit.modified}>{isoDateTimeToPretty(lastEdit.modified)}</time>, av:{' '}
      <EditorName editorId={lastEdit.navIdent} />
    </LastEditorContainer>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const LastEditorContainer = styled.span`
  display: flex;
  align-items: center;
  white-space: pre;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
