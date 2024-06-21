import { TrashIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { EditorName } from '@app/components/editor-name/editor-name';
import { AllMaltekstseksjonReferences } from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { SavedStatus, SavedStatusProps } from '@app/components/saved-status/saved-status';
import { isoDateTimeToPretty } from '@app/domain/date';
import { isGodFormuleringType, isRegelverkType, isRichTextType } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { usePublishMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { IEditor, TextChangeType } from '@app/types/common-text-types';
import { TextType } from '@app/types/texts/common';
import { LANGUAGE_NAMES, Language } from '@app/types/texts/language';
import { IText } from '@app/types/texts/responses';
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
  const lastPublishedVersion = useMemo(() => versions.find((version) => version.published), [versions]);

  const { id, editors, publishedMaltekstseksjonIdList, draftMaltekstseksjonIdList, textType } = text;

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
          <DeleteDraftButton id={id} title={text.title} onDraftDeleted={onDraftDeleted}>
            {lastPublishedVersion === undefined ? 'Slett utkast og flytt til avpubliserte' : 'Slett utkast'}
          </DeleteDraftButton>
        ) : null}
      </Row>

      <Row>
        <AllMaltekstseksjonReferences
          currentMaltekstseksjonId={id}
          draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
          publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
        />

        <SavedStatus {...status} />
        <LastEditor editors={editors} textType={textType} />
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

interface LastEditorProps {
  editors: IEditor[];
  textType: TextType;
}

const LastEditor = ({ editors, textType }: LastEditorProps) => {
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

  const [lastEdit] = editors.filter(
    (e) => e.changeType === changeType || e.changeType === TextChangeType.TEXT_VERSION_CREATED,
  );

  if (lastEdit === undefined) {
    return null;
  }

  return (
    <LastEditorContainer>
      Sist endret: <time dateTime={lastEdit.created}>{isoDateTimeToPretty(lastEdit.created)}</time>, av:{' '}
      <EditorName editorId={lastEdit.navIdent} />
    </LastEditorContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 16px;
`;

const LastEditorContainer = styled.span`
  display: flex;
  align-items: center;
  white-space: pre;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: flex-end;
`;
