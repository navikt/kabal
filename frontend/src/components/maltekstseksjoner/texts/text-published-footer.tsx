import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useCreateDraftFromVersionMutation } from '@app/redux-api/texts/mutations';
import { REGELVERK_TYPE } from '@app/types/common-text-types';
import type { IPublishedText } from '@app/types/texts/responses';
import { PlusIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

interface Props {
  text: IPublishedText;
  maltekstseksjonId?: string;
  hasDraft: boolean;
}

export const PublishedTextFooter = ({ text, maltekstseksjonId, hasDraft }: Props) => {
  const [createDraft] = useCreateDraftFromVersionMutation();
  const query = useTextQuery();
  const hasLanguage = text.textType !== REGELVERK_TYPE;
  const navigate = useNavigateToStandaloneTextVersion(hasLanguage);

  const { id, versionId, publishedDateTime, title } = text;

  const createDraftAndNotify = useCallback(async () => {
    const draft = await createDraft({ id, title, versionId, query }).unwrap();
    navigate({ id: draft.id, versionId: draft.versionId });
  }, [createDraft, id, title, versionId, query, navigate]);

  return (
    <HStack justify="space-between" align="center" gap="2" marginBlock="2 0">
      {hasDraft ? null : (
        <Tooltip content="Opprett et utkast basert på denne versjonen.">
          <Button size="small" variant="secondary" onClick={createDraftAndNotify} icon={<PlusIcon aria-hidden />}>
            Nytt utkast
          </Button>
        </Tooltip>
      )}

      <DuplicateTextButton {...text} />

      <HStack align="center" justify="end" flexGrow="1">
        <AllMaltekstseksjonReferences
          draftMaltekstseksjonIdList={text.draftMaltekstseksjonIdList}
          publishedMaltekstseksjonIdList={text.publishedMaltekstseksjonIdList}
          currentMaltekstseksjonId={maltekstseksjonId}
        />
        <span>
          Publisert: <time dateTime={publishedDateTime}>{isoDateTimeToPretty(publishedDateTime)}</time>, av:{' '}
          {text.publishedByActor.navn}
        </span>
      </HStack>
    </HStack>
  );
};
