import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useKlageenheterOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { KlageenhetSelect, TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import { useUpdateTextMutation } from '@app/redux-api/texts';
import {
  IText,
  IUpdatePlainTextProperty,
  IUpdateRichTextProperty,
  PlainTextTypes,
  RichTextTypes,
} from '@app/types/texts/texts';
import { DateTime } from '../../datetime/datetime';
import { HjemlerSelect } from '../hjemler-select';
import { useTextQuery } from '../hooks/use-text-query';
import { DeleteTextButton } from '../smart-editor-texts-delete';
import { ContentEditor } from './content-editor';

type Key = IUpdatePlainTextProperty['key'] | IUpdateRichTextProperty['key'];
type Value = IUpdatePlainTextProperty['value'] | IUpdateRichTextProperty['value'];

interface Props {
  savedText: IText;
  autofocus?: boolean;
}

export const EditSmartEditorText = ({ autofocus, savedText }: Props) => {
  const [update, status] = useUpdateTextMutation({
    fixedCacheKey: savedText.id,
  });
  const query = useTextQuery();
  const [text, setText] = useState<IText>(savedText);
  const { id, modified, created, ytelseHjemmelList, utfall, enheter, templateSectionList, title, textType } = text;
  const updateUnsavedText = (value: Value, key: Key) => setText({ ...text, [key]: value });
  const klageenheterOptions = useKlageenheterOptions();

  const save = useCallback(() => update({ text, query }), [query, text, update]);

  useEffect(() => {
    if (savedText.id !== text.id) {
      setText(savedText);
    }
  }, [savedText, text.id]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    },
    [save],
  );

  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;
  const hasFixedLocation = isHeaderFooter || textType === RichTextTypes.REGELVERK;

  return (
    <Fragment key={id}>
      <Header onKeyDown={onKeyDown}>
        <TextField
          label="Tittel"
          size="small"
          value={title}
          onChange={({ target }) => updateUnsavedText(target.value, 'title')}
          autoFocus={autofocus}
        />

        <LineContainer>
          <strong>Sist endret:</strong>
          <DateTime modified={modified} created={created} />
        </LineContainer>

        <LineContainer>
          {hasFixedLocation ? null : (
            <TemplateSectionSelect
              selected={templateSectionList}
              onChange={(value) => updateUnsavedText(value, 'templateSectionList')}
              textType={textType}
              templatesSelectable={textType === RichTextTypes.GOD_FORMULERING}
            >
              Maler og seksjoner
            </TemplateSectionSelect>
          )}

          {isHeaderFooter ? null : (
            <HjemlerSelect
              selected={ytelseHjemmelList}
              onChange={(value: Value) => updateUnsavedText(value, 'ytelseHjemmelList')}
              ytelserSelectable={textType !== RichTextTypes.REGELVERK}
            />
          )}

          {isHeaderFooter ? null : (
            <UtfallSetFilter selected={utfall} onChange={(value) => updateUnsavedText(value, 'utfall')} />
          )}

          {isHeaderFooter ? (
            <KlageenhetSelect
              selected={enheter ?? []}
              onChange={(value) => updateUnsavedText(value, 'enheter')}
              options={klageenheterOptions}
            >
              Enheter
            </KlageenhetSelect>
          ) : null}
        </LineContainer>

        <Tags {...text} />
      </Header>

      <ContentEditor text={text} update={updateUnsavedText} onKeyDown={onKeyDown} />

      <Buttons onKeyDown={onKeyDown}>
        <Button onClick={save} icon={<CheckmarkIcon aria-hidden />} size="small" loading={status.isLoading}>
          Lagre og publiser
        </Button>
        <DeleteTextButton id={id} title={savedText.title} />
      </Buttons>
    </Fragment>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: var(--a-surface-subtle);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 16px;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
