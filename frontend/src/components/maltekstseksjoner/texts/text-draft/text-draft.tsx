import { EditableTitle } from '@app/components/editable-title/editable-title';
import { LanguageEditor, type RichTexts } from '@app/components/maltekstseksjoner/texts/text-draft/language-editor';
import { CreateTranslatedRichText } from '@app/components/smart-editor-texts/create-translated-text';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
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
import { BodyShort, HStack, HelpText, Label, Loader, Switch, Tooltip, VStack } from '@navikt/ds-react';
import { getEndPoint } from '@udecode/plate-common';
import { focusEditor, isEditorFocused } from '@udecode/plate-common/react';
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
  const queryRef = useRef({ textType: text.textType });
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

      const promises = LANGUAGES.map((lang) => {
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

    const timer = setTimeout(() => {
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

  const isSaving = richTextStatus.isLoading || isTextTypeUpdating || isTitleUpdating;
  const [lastEdit] = text.edits;

  const modifiedId = `${text.id}-modified`;

  return (
    <VStack ref={containerRef} position="relative" paddingBlock="2 0">
      <VStack as="header" gap="2" marginBlock="0 2">
        <HStack gap="2" align="center" justify="space-between" flexGrow="1">
          <HStack gap="2" align="center">
            <EditableTitle
              label="Teksttittel"
              title={text.title}
              onChange={(title) => updateTitle({ id: text.id, query: queryRef.current, title })}
              isLoading={isTitleUpdating}
            />
          </HStack>

          <HStack gap="2" align="center">
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
          </HStack>
        </HStack>

        <HStack align="center" gap="1">
          <Label size="small" htmlFor={modifiedId}>
            Sist endret:
          </Label>

          <BodyShort size="small" id={modifiedId}>
            {isSaving ? (
              <Loader size="xsmall" />
            ) : (
              <time dateTime={text.modified}>{isoDateTimeToPretty(text.modified)}</time>
            )}
            {lastEdit === undefined ? null : <span>, av {lastEdit.actor.navn}</span>}
          </BodyShort>
        </HStack>
      </VStack>

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
    </VStack>
  );
};
