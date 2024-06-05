import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { DeleteDraftButton } from '@app/components/smart-editor-texts/delete-draft-button';
import { isoDateTimeToPretty } from '@app/domain/date';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { IDraftRichText } from '@app/types/texts/responses';

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
  const [lastEditor] = text.editors;

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
        {lastEditor === undefined ? null : (
          <span>
            , av: <EditorName editorId={lastEditor.navIdent} />
          </span>
        )}
      </Right>
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  margin-top: 8px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  white-space: pre;
`;
