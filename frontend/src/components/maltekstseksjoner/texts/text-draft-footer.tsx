import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { DeleteDraftButton } from '@app/components/smart-editor-texts/delete-draft-button';
import { isoDateTimeToPretty } from '@app/domain/date';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import type { IDraftRichText } from '@app/types/texts/responses';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  text: IDraftRichText;
  isSaving: boolean;
  isDeletable: boolean;
  onDraftDeleted: () => void;
  onPublish: () => void;
  maltekstseksjonId: string;
  error?: string;
}

export const DraftTextFooter = ({
  text,
  isSaving,
  isDeletable,
  onDraftDeleted,
  onPublish,
  maltekstseksjonId,
  error,
}: Props) => {
  const [, { isLoading: isPublishing }] = usePublishMutation({ fixedCacheKey: text.id });
  const { id, title, modified } = text;
  const [lastEdit] = text.edits;

  return (
    <ButtonsContainer>
      <Button
        variant="primary"
        size="small"
        onClick={onPublish}
        loading={isPublishing}
        icon={<UploadIcon aria-hidden />}
        disabled={isSaving}
      >
        Publiser
      </Button>
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      <DeleteDraftButton id={id} title={title} onDraftDeleted={onDraftDeleted}>
        {isDeletable ? 'Slett utkast' : 'Slett tekst'}
      </DeleteDraftButton>
      <Right>
        <div style={{ display: 'flex' }}>
          <AllMaltekstseksjonReferences
            draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
            publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
            currentMaltekstseksjonId={maltekstseksjonId}
          />
        </div>
        Sist endret:{' '}
        {isSaving ? <Loader size="xsmall" /> : <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>}
        {lastEdit === undefined ? null : <span>, av: {lastEdit.actor.navn}</span>}
      </Right>
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
  margin-top: var(--a-spacing-2);
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  white-space: pre;
`;
