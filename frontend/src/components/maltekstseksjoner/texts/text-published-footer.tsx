import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/texts/mutations';
import type { IPublishedText } from '@app/types/texts/responses';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';

interface Props {
  text: IPublishedText;
  onDraftCreated: (versionId: string) => void;
  maltekstseksjonId?: string;
  hasDraft: boolean;
}

export const PublishedTextFooter = ({ text, onDraftCreated, maltekstseksjonId, hasDraft }: Props) => {
  const [createDraft] = useCreateDraftFromVersionMutation();
  const query = useTextQuery();

  const { id, versionId, publishedDateTime, title } = text;

  const createDraftAndNotify = useCallback(async () => {
    const draft = await createDraft({ id, title, versionId, query }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, title, versionId, query, onDraftCreated]);

  return (
    <Container>
      {hasDraft ? null : (
        <Button size="small" variant="secondary" onClick={createDraftAndNotify}>
          Opprett utkast basert på denne versjonen
        </Button>
      )}
      <Right>
        <div style={{ display: 'flex' }}>
          <AllMaltekstseksjonReferences
            draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
            publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
            currentMaltekstseksjonId={maltekstseksjonId}
          />
        </div>
        Publisert: <time dateTime={publishedDateTime}>{isoDateTimeToPretty(publishedDateTime)}</time>, av:{' '}
        {text.publishedByActor.navn}
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--a-spacing-2);
  white-space: nowrap;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  white-space: pre;
`;
