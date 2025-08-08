import { DeleteDraftButton } from '@app/components/smart-editor-texts/delete-draft-button';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { isDepublished, isPublished } from '@app/components/smart-editor-texts/functions/status-helpers';
import { UnpublishTextButton } from '@app/components/smart-editor-texts/unpublish-text-button';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import type { IText } from '@app/types/texts/responses';
import { TrashIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, HStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface Props {
  text: IText;
  onDraftDeleted: () => void;
  onPublish: () => void;
  deleteTranslation?: () => void;
  error?: string;
}

export const TextDraftActions = ({ text, onDraftDeleted, onPublish, deleteTranslation, error }: Props) => {
  const [, { isLoading: publishIsLoading }] = usePublishMutation({ fixedCacheKey: text.id });

  const { id, textType } = text;

  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const publishedVersion = useMemo(() => versions.find(({ published }) => published), [versions]);
  const willBeMovedToDepublished = useMemo(
    () => versions.some(isDepublished) && !versions.some(isPublished),
    [versions],
  );

  const isDraft = text.publishedDateTime === null;

  return (
    <HStack gap="2" justify="end" marginInline="auto 0">
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      <Button onClick={onPublish} icon={<UploadIcon aria-hidden />} size="small" loading={publishIsLoading}>
        Publiser
      </Button>

      <DuplicateTextButton {...text} />

      <DeleteLanguageVersion deleteTranslation={deleteTranslation} />

      {isDraft ? (
        <DeleteDraftButton
          id={id}
          title={text.title}
          onDraftDeleted={onDraftDeleted}
          tooltip={willBeMovedToDepublished ? 'Slett utkast og sett tekst som avpublisert.' : undefined}
        >
          {willBeMovedToDepublished ? 'Slett utkast og avpubliser' : 'Slett utkast'}
        </DeleteDraftButton>
      ) : null}

      {isDraft || publishedVersion === undefined ? null : (
        <UnpublishTextButton publishedText={publishedVersion} textType={textType} />
      )}
    </HStack>
  );
};

interface DeleteLanguageVersionProps {
  deleteTranslation?: () => void;
}

const DeleteLanguageVersion = ({ deleteTranslation }: DeleteLanguageVersionProps) => {
  const [confirm, setConfirm] = useState(false);
  const language = useRedaktoerLanguage();

  if (deleteTranslation === undefined) {
    return null;
  }

  if (confirm) {
    return (
      <>
        <Button variant="danger" size="small" onClick={deleteTranslation} icon={<TrashIcon aria-hidden />}>
          Slett versjon for {LANGUAGE_NAMES[language].toLowerCase()}
        </Button>
        <Button size="small" variant="secondary-neutral" onClick={() => setConfirm(false)}>
          Avbryt
        </Button>
      </>
    );
  }

  return (
    <Button variant="danger" size="small" onClick={() => setConfirm(!confirm)} icon={<TrashIcon aria-hidden />}>
      Slett {LANGUAGE_NAMES[language].toLowerCase()}versjon
    </Button>
  );
};
