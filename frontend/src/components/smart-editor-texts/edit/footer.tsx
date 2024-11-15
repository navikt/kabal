import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { SavedStatus, type SavedStatusProps } from '@app/components/saved-status/saved-status';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { isDepublished, isPublished } from '@app/components/smart-editor-texts/functions/status-helpers';
import { isoDateTimeToPretty } from '@app/domain/date';
import { isGodFormuleringType, isRegelverkType, isRichTextType } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { type IEdit, TextChangeType } from '@app/types/common-text-types';
import type { TextType } from '@app/types/texts/common';
import { LANGUAGE_NAMES, Language } from '@app/types/texts/language';
import type { IText } from '@app/types/texts/responses';
import { TrashIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { DeleteDraftButton } from '../delete-draft-button';

interface Props {
  text: IText;
  onDraftDeleted: () => void;
  status: SavedStatusProps;
  onPublish: () => void;
  deleteTranslation?: () => void;
  error?: string;
}

export const Footer = ({ text, onDraftDeleted, status, onPublish, deleteTranslation, error }: Props) => {
  const [, { isLoading: publishIsLoading }] = usePublishMutation({ fixedCacheKey: text.id });
  const { data: versions = [] } = useGetTextVersionsQuery(text.id);
  const willBeMovedToDepublished = useMemo(
    () => versions.some(isDepublished) && !versions.some(isPublished),
    [versions],
  );

  const { id, edits, publishedMaltekstseksjonIdList, draftMaltekstseksjonIdList, textType } = text;

  const isDraft = text.publishedDateTime === null;

  return (
    <Container>
      <Row>
        {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
        <Button onClick={onPublish} icon={<UploadIcon aria-hidden />} size="small" loading={publishIsLoading}>
          Publiser
        </Button>

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

        <DuplicateTextButton {...text} />
      </Row>

      <Row>
        <AllMaltekstseksjonReferences
          currentMaltekstseksjonId={id}
          draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
          publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
        />

        <SavedStatus {...status} />
        <LastEdit edits={edits} textType={textType} />
      </Row>
    </Container>
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
        <Button size="small" variant="secondary" onClick={() => setConfirm(false)}>
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

interface LastEditProps {
  edits: IEdit[];
  textType: TextType;
}

const LastEdit = ({ edits, textType }: LastEditProps) => {
  const language = useRedaktoerLanguage();
  const changeType: TextChangeType = useMemo(() => {
    if (isRichTextType(textType) || isGodFormuleringType(textType)) {
      return language === Language.NB ? TextChangeType.RICH_TEXT_NB : TextChangeType.RICH_TEXT_NN;
    }

    if (isRegelverkType(textType)) {
      return TextChangeType.RICH_TEXT_UNTRANSLATED;
    }

    return language === Language.NB ? TextChangeType.PLAIN_TEXT_NB : TextChangeType.PLAIN_TEXT_NN;
  }, [language, textType]);

  const [lastEdit] = edits.filter(
    (e) => e.changeType === changeType || e.changeType === TextChangeType.TEXT_VERSION_CREATED,
  );

  if (lastEdit === undefined) {
    return null;
  }

  return (
    <LastEditContainer>
      <span>Sist endret: </span>
      <time dateTime={lastEdit.created}>{isoDateTimeToPretty(lastEdit.created)}</time>
      <span> av {lastEdit.actor.navn}</span>
    </LastEditContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
  padding: var(--a-spacing-4);
`;

const LastEditContainer = styled.span`
  display: flex;
  align-items: center;
  white-space: pre;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
  width: 100%;
  justify-content: flex-end;
`;
