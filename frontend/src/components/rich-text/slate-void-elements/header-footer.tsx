import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { useSelected, useSlateStatic } from 'slate-react';
import { styled } from 'styled-components';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { DistribusjonsType } from '@app/types/documents/documents';
import { ApiQuery, IPlainText, PlainTextTypes } from '@app/types/texts/texts';
import { SmartEditorContext } from '../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../smart-editor/hooks/use-query';
import { ShowTags } from '../slate-elements/maltekst/show-tags';
import { RenderElementProps } from '../slate-elements/render-props';
import { ParagraphStyle } from '../styled-elements/content';
import { TextAlignEnum, UndeletableVoidElementsEnum } from '../types/editor-enums';
import { FooterElementType, HeaderElementType } from '../types/editor-void-types';

type ElementTypes = HeaderElementType | FooterElementType;

export const HeaderFooterElement = (props: RenderElementProps<ElementTypes>) => {
  const { dokumentTypeId } = useContext(SmartEditorContext);

  if (dokumentTypeId === DistribusjonsType.NOTAT) {
    return null;
  }

  return <RenderHeaderFooterElement {...props} />;
};

const RenderHeaderFooterElement = ({ element, attributes, children }: RenderElementProps<ElementTypes>) => {
  const { templateId } = useContext(SmartEditorContext);
  const isSelected = useSelected();

  const textType = element.type === UndeletableVoidElementsEnum.HEADER ? PlainTextTypes.HEADER : PlainTextTypes.FOOTER;

  const query = useQuery({ textType, templateId });
  const [text, setText] = useState<IPlainText>();

  const [getTexts, { isLoading, isUninitialized }] = useLazyGetTextsQuery();

  const editor = useSlateStatic();

  const loadMaltekst = useCallback(
    async (e: ElementTypes, q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const content = (await getTexts(q).unwrap())
          .map((t) => (t.textType !== PlainTextTypes.HEADER && t.textType !== PlainTextTypes.FOOTER ? null : t))
          .filter(isNotNull);

        if (content.length === 0) {
          return;
        }

        setText(content[0]);

        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes<ElementTypes>(
            editor,
            { content: content[0]?.plainText },
            { match: (n) => n === e, voids: true, at: [] },
          );
        });
      } catch {
        if (e.content === null) {
          HistoryEditor.withoutSaving(editor, () => {
            Transforms.setNodes<ElementTypes>(editor, { content: '' }, { match: (n) => n === e, voids: true, at: [] });
          });
        }
      }
    },
    [editor, getTexts],
  );

  useEffect(() => {
    loadMaltekst(element, query);
  }, [element, loadMaltekst, query]);

  return (
    <Container {...attributes} contentEditable={false} $isFocused={isSelected}>
      <HeaderFooterContent text={text} query={query} isLoading={isLoading && isUninitialized} type={element.type} />
      {children}
    </Container>
  );
};

const Container = styled.div<{ $isFocused: boolean }>`
  color: #666;
  border-radius: 2px;
  transition:
    background-color 0.2s ease-in-out,
    outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
`;

interface HeaderFooterContentProps {
  text?: IPlainText;
  query: ApiQuery | typeof skipToken;
  isLoading: boolean;
  type: UndeletableVoidElementsEnum.HEADER | UndeletableVoidElementsEnum.FOOTER;
}

const HeaderFooterContent = ({ text, query, isLoading, type }: HeaderFooterContentProps) => {
  if (isLoading || typeof text === 'undefined') {
    return (
      <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>
        <Loader />
      </ParagraphStyle>
    );
  }

  const { plainText, created, modified, title, ...limits } = text;

  if (plainText === null) {
    return <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>Ingen {getLabel(type)} funnet.</ParagraphStyle>;
  }

  return (
    <section>
      <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>{plainText}</ParagraphStyle>
      <ShowTags created={created} modified={modified} title={title} limits={limits} query={query} />
    </section>
  );
};

const getLabel = (type: UndeletableVoidElementsEnum.HEADER | UndeletableVoidElementsEnum.FOOTER) =>
  type === UndeletableVoidElementsEnum.HEADER ? 'topptekst' : 'bunntekst';
