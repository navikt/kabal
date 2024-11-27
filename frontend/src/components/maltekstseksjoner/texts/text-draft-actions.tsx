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

export const DraftTextActions = ({
  text,
  isSaving,
  isDeletable,
  onDraftDeleted,
  onPublish,
  maltekstseksjonId,
  error,
}: Props) => {
  const [, { isLoading: isPublishing }] = usePublishMutation({ fixedCacheKey: text.id });
  const { id, title, textType } = text;

  return (
    <HStack justify="space-between" align="center">
      <AllMaltekstseksjonReferences
        textType={textType}
        draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
        publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
        currentMaltekstseksjonId={maltekstseksjonId}
      />

      <HStack gap="2" justify="end" marginInline="auto 0">
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

        <DuplicateTextButton {...text} />

        <DeleteDraftButton id={id} title={title} onDraftDeleted={onDraftDeleted}>
          {isDeletable ? 'Slett utkast' : 'Slett tekst'}
        </DeleteDraftButton>
      </HStack>
    </HStack>
  );
};
