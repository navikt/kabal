import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { DeleteDraftButton } from '@app/components/smart-editor-texts/delete-draft-button';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import type { IDraftRichText } from '@app/types/texts/responses';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, HStack } from '@navikt/ds-react';

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
  const { id, title } = text;

  return (
    <HStack justify="start" align="center" gap="2" marginBlock="4 0">
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

      <AllMaltekstseksjonReferences
        draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
        publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
        currentMaltekstseksjonId={maltekstseksjonId}
      />
    </HStack>
  );
};
