import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useLanguageRedaktoer } from '@app/hooks/use-language-redaktoer';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/texts/mutations';

interface Props {
  text: {
    id: string;
    versionId: string;
    publishedDateTime: string;
    title: string;
    publishedBy: string;
    draftMaltekstseksjonIdList: string[];
    publishedMaltekstseksjonIdList: string[];
  };
  onDraftCreated: (versionId: string) => void;
  maltekstseksjonId?: string;
}

export const PublishedTextFooter = ({ text, onDraftCreated, maltekstseksjonId }: Props) => {
  const [createDraft] = useCreateDraftFromVersionMutation();
  const query = useTextQuery();
  const language = useLanguageRedaktoer();

  const { id, versionId, publishedDateTime, title } = text;

  const createDraftAndNotify = useCallback(async () => {
    if (language === null) {
      return;
    }

    const draft = await createDraft({ id, title, versionId, query, language }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, title, versionId, query, language, onDraftCreated]);

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
