import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { DeleteDraftButton } from '@app/components/smart-editor-texts/delete-draft-button';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { isoDateTimeToPretty } from '@app/domain/date';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import type { IDraftRichText } from '@app/types/texts/responses';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, HStack, Loader } from '@navikt/ds-react';

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
    <HStack justify="space-between" align="center" gap="2" marginBlock="2 0">
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

      <DuplicateTextButton {...text} />

      <HStack align="center" justify="end" flexGrow="1">
        <AllMaltekstseksjonReferences
          draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
          publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
          currentMaltekstseksjonId={maltekstseksjonId}
        />
        <span>
          <span>Sist endret: </span>
          {isSaving ? <Loader size="xsmall" /> : <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>}
          {lastEdit === undefined ? null : <span> av {lastEdit.actor.navn}</span>}
        </span>
      </HStack>
    </HStack>
  );
};
