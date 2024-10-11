import { EditableTitle } from '@app/components/editable-title/editable-title';
import { LanguageEditor, type RichTexts } from '@app/components/maltekstseksjoner/texts/text-draft/language-editor';
import { Container, Header, HeaderGroup } from '@app/components/maltekstseksjoner/texts/text-draft/styled-components';
import { CreateTranslatedRichText } from '@app/components/smart-editor-texts/create-translated-text';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useTrashQuery } from '@app/hooks/use-trash-query';
import type { RichTextEditor } from '@app/plate/types';
import {
  usePublishMutation,
  useSetTextTitleMutation,
  useSetTextTypeMutation,
  useUpdateRichTextMutation,
} from '@app/redux-api/texts/mutations';
import { RichTextTypes } from '@app/types/common-text-types';
import { LANGUAGES, type Language, isLanguage } from '@app/types/texts/language';
import type { IDraftRichText } from '@app/types/texts/responses';
import { HelpText, Switch, Tooltip } from '@navikt/ds-react';
import { focusEditor, getEndPoint, isEditorFocused } from '@udecode/plate-common';
import { useCallback, useEffect, useRef, useState } from 'react';
import { areDescendantsEqual } from '../../../../functions/are-descendants-equal';
import { DraftTextFooter } from '../text-draft-footer';

interface Props {
  text: IDraftRichText;
  isActive: boolean;
  setActive: (textId: string) => void;
  isDeletable: boolean;
  onDraftDeleted: () => void;
  maltekstseksjonId: string;
}

export const DraftText = ({ text, isActive, setActive, ...rest }: Props) => {
  const [updateTextType, { isLoading: isTextTypeUpdating }] = useSetTextTypeMutation();
  const [updateTitle, { isLoading: isTitleUpdating }] = useSetTextTitleMutation();
  const [updateRichText, richTextStatus] = useUpdateRichTextMutation();
  const [publish] = usePublishMutation({ fixedCacheKey: text.id });
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditor>(null);
  const language = useRedaktoerLanguage();
  const [richTexts, setRichTexts] = useState<RichTexts>(text.richText);
  const { id } = text;
  const isUpdating = useRef(false);
  const richTextRef = useRef(richTexts);
  const trash = useTrashQuery();
  const queryRef = useRef({ textType: text.textType, trash });
  const [error, setError] = useState<string>();

  useEffect(() => {
    setRichTexts(text.richText);
  }, [text.richText]);

  useEffect(() => {
    if (isActive && editorRef.current !== null && !isEditorFocused(editorRef.current)) {
      setTimeout(() => {
        if (editorRef.current !== null) {
          focusEditor(editorRef.current, getEndPoint(editorRef.current, []));
        }
      }, 0);
    }
  }, [isActive]);

  const updateContentIfChanged = useCallback(
    async (_richTexts: RichTexts) => {
      if (isUpdating.current) {
        return;
      }

      const promises = LANGUAGES.map(async (lang) => {
        const localRichText = _richTexts[lang];

        if (areDescendantsEqual(localRichText ?? [], text.richText[lang] ?? [])) {
          return;
        }

        isUpdating.current = true;
        const query = queryRef.current;

        return updateRichText({ query, id, richText: localRichText, language: lang });
      });

      await Promise.all(promises);

      isUpdating.current = false;
    },
    [id, text.richText, updateRichText],
  );

  useEffect(() => {
    if (isUpdating.current || areDescendantsEqual(richTexts[language] ?? [], text.richText[language] ?? [])) {
      return;
    }

    const timer = setTimeout(async () => {
      if (isUpdating.current) {
        return;
      }

      updateContentIfChanged(richTexts);
    }, 1000);

    return () => clearTimeout(timer);
  }, [language, richTexts, text.richText, updateContentIfChanged]);

  useEffect(
    () => () => {
      // Save on unmount, if changed.
      updateContentIfChanged(richTextRef.current);
    },
    [updateContentIfChanged],
  );

  const onPublish = useCallback(async () => {
    await updateContentIfChanged(richTextRef.current);
    const query = queryRef.current;

    const untranslated: Language[] = Object.entries(text.richText)
      .filter(([, t]) => t === null)
      .map(([l]) => l)
      .filter(isLanguage);

    if (untranslated.length > 0) {
      setError(`Teksten må oversettes til ${getLanguageNames(untranslated)} før publisering`);

      return;
    }

    setError(undefined);

    await publish({ id, query });
  }, [id, publish, text.richText, updateContentIfChanged]);

  const isLocked = text.textType === RichTextTypes.MALTEKST;

  const savedContent = text.richText[language];

  return (
    <Container ref={containerRef}>
      <Header>
        <HeaderGroup>
          <EditableTitle
            label="Teksttittel"
            title={text.title}
            onChange={(title) => updateTitle({ id: text.id, query: queryRef.current, title })}
            isLoading={isTitleUpdating}
          />
        </HeaderGroup>

        <HeaderGroup>
          <Tooltip content={isLocked ? 'Lås opp' : 'Lås igjen'}>
            <Switch
              checked={isLocked}
              size="small"
              loading={isTextTypeUpdating}
              onChange={({ target }) => {
                const newTextType = target.checked ? RichTextTypes.MALTEKST : RichTextTypes.REDIGERBAR_MALTEKST;
                queryRef.current.textType = newTextType;
                updateTextType({ id, newTextType, oldTextType: text.textType });
              }}
            >
              Låst
            </Switch>
          </Tooltip>
          <HelpText title="Hva er låsing?">
            En låst tekst vil ikke kunne redigeres av saksbehandler med unntak av innfyllingsfelter som legges inn i
            teksten her.
          </HelpText>
        </HeaderGroup>
      </Header>

      {savedContent === null ? (
        <CreateTranslatedRichText id={text.id} />
      ) : (
        <>
          {LANGUAGES.map((lang) => (
            <LanguageEditor
              key={lang}
              language={lang}
              text={text}
              savedContent={savedContent}
              richTexts={richTexts}
              setRichTexts={setRichTexts}
              editorRef={editorRef}
              richTextRef={richTextRef}
              setActive={setActive}
            />
          ))}

          <DraftTextFooter
            text={text}
            isSaving={richTextStatus.isLoading || isTextTypeUpdating || isTitleUpdating}
            onPublish={onPublish}
            error={error}
            {...rest}
          />
        </>
      )}
    </Container>
  );
};
