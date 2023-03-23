import React from 'react';
import { IText, IUpdatePlainTextProperty, IUpdateRichTextProperty, isPlainText } from '@app/types/texts/texts';
import { HeaderFooterEditor } from './header-footer';
import { RichTextEditor } from './rich-text';

type Key = IUpdatePlainTextProperty['key'] | IUpdateRichTextProperty['key'];
type Value = IUpdatePlainTextProperty['value'] | IUpdateRichTextProperty['value'];

interface Props {
  text: IText;
  update: (value: Value, key: Key) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ContentEditor = ({ text, update, onKeyDown }: Props) => {
  if (isPlainText(text)) {
    return (
      <HeaderFooterEditor
        key={text.id}
        textId={text.id}
        savedPlainText={text.plainText}
        type={text.textType}
        setContent={(content) => update(content, 'plainText')}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <RichTextEditor
      key={text.id}
      textId={text.id}
      savedContent={text.content}
      setContent={(content) => update(content, 'content')}
      onKeyDown={onKeyDown}
    />
  );
};
