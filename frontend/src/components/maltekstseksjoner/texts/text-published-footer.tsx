import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/texts/mutations';
import { IPublishedTextMetadata } from '@app/types/texts/responses';

interface Props {
  text: IPublishedTextMetadata;
  onDraftCreated: (versionId: string) => void;
  maltekstseksjonId?: string;
}

export const PublishedTextFooter = ({ text, onDraftCreated, maltekstseksjonId }: Props) => {
  const [createDraft] = useCreateDraftFromVersionMutation();

  const { id, versionId, publishedDateTime, title } = text;

  const createDraftAndNotify = useCallback(async () => {
    const draft = await createDraft({ id, title, versionId }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, title, versionId, onDraftCreated]);

  return (
    <Container>
      <Button size="small" variant="secondary" onClick={createDraftAndNotify}>
        Opprett utkast basert på denne versjonen
      </Button>
      <Right>
        <div style={{ display: 'flex' }}>
          <AllMaltekstseksjonReferences
            draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
            publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
            currentMaltekstseksjonId={maltekstseksjonId}
          />
        </div>
        Publisert: <time dateTime={publishedDateTime}>{isoDateTimeToPretty(publishedDateTime)}</time>, av:{' '}
        <EditorName editorId={text.publishedBy} />
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  white-space: nowrap;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  white-space: pre;
`;
