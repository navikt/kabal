import { UploadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { SavedStatus, SavedStatusProps } from '@app/components/saved-status/saved-status';
import { isoDateTimeToPretty } from '@app/domain/date';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { IEditor } from '@app/types/common-text-types';
import { IText } from '@app/types/texts/responses';
import { DeleteDraftButton } from '../delete-draft-button';

interface Props {
  text: IText;
  onDraftDeleted: () => void;
  status: SavedStatusProps;
  onPublish: () => void;
}

export const Footer = ({ text, onDraftDeleted, status, onPublish }: Props) => {
  const [, { isLoading: publishIsLoading }] = usePublishMutation({ fixedCacheKey: text.id });
  const { data: versions = [] } = useGetTextVersionsQuery(text.id);

  const { id, editors, publishedMaltekstseksjonIdList, draftMaltekstseksjonIdList } = text;

  const isDraft = text.publishedDateTime === null;

  return (
    <Container>
      <Left>
        <Button onClick={onPublish} icon={<UploadIcon aria-hidden />} size="small" loading={publishIsLoading}>
          Publiser
        </Button>
        {isDraft ? (
          <DeleteDraftButton id={id} title={text.title} onDraftDeleted={onDraftDeleted}>
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
