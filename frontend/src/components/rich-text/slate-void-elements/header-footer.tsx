import { Refresh } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { useSlateStatic } from 'slate-react';
import { useLazyGetTextsQuery } from '../../../redux-api/texts';
import { ApiQuery, IText, TextTypes } from '../../../types/texts/texts';
import { SmartEditorContext } from '../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../smart-editor/hooks/use-query';
import { ParagraphStyle } from '../styled-elements/content';
import { TextAlignEnum, UndeletableVoidElementsEnum } from '../types/editor-enums';
import { FooterElementType, HeaderElementType } from '../types/editor-void-types';
import { ShowTags } from './maltekst/show-tags';
import { MaltekstContainer, ReloadButton, ReloadButtonWrapper } from './maltekst/styled-components';

type ElementTypes = HeaderElementType | FooterElementType;

interface Props {
  element: ElementTypes;
}

export const HeaderFooterElement = ({ element }: Props) => {
  const { showMaltekstTags, activeElement, templateId } = useContext(SmartEditorContext);

  const textType = element.type === UndeletableVoidElementsEnum.HEADER ? TextTypes.HEADER : TextTypes.FOOTER;

  const query = useQuery({ textType, templateId: templateId ?? undefined });
  const [text, setText] = useState<IText>();

  const [getTexts, { isLoading, isUninitialized }] = useLazyGetTextsQuery();

  const editor = useSlateStatic();

  const loadMaltekst = useCallback(
    async (e: ElementTypes, q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const content = await getTexts(q).unwrap();

        if (content.length === 0) {
          return;
        }

        setText(content[0]);

        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes<ElementTypes>(
            editor,
            { content: content[0]?.plainText ?? '' },
            { match: (n) => n === e, voids: true, at: [] }
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
    [editor, getTexts]
  );

  useEffect(() => {
    loadMaltekst(element, query);
  }, [element, loadMaltekst, query]);

  return (
    <MaltekstContainer contentEditable={false} isActive={activeElement === element} showTags={showMaltekstTags}>
      <HeaderFooterContent
        text={text}
        query={query}
        isLoading={isLoading && isUninitialized}
        reload={() => loadMaltekst(element, query)}
        type={element.type}
      />
    </MaltekstContainer>
  );
};

interface HeaderFooterContentProps {
  text?: IText;
  query: ApiQuery | typeof skipToken;
  isLoading: boolean;
  reload: () => Promise<void>;
  type: UndeletableVoidElementsEnum.HEADER | UndeletableVoidElementsEnum.FOOTER;
}

export const HeaderFooterContent = ({ text, query, isLoading, reload, type }: HeaderFooterContentProps) => {
  if (isLoading || typeof text === 'undefined') {
    return (
      <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>
        <Loader />
      </ParagraphStyle>
    );
  }

  const { plainText, created, modified, title, ...limits } = text;

  if (plainText === null) {
    return (
      <>
        <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>Ingen {getLabel(type)} funnet.</ParagraphStyle>
        <ReloadButtonWrapper>
          <ReloadButton onClick={reload}>
            <Refresh />
          </ReloadButton>
        </ReloadButtonWrapper>
      </>
    );
  }

  return (
    <>
      <section>
        <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>{plainText}</ParagraphStyle>
        <ShowTags created={created} modified={modified} title={title} limits={limits} query={query} />
      </section>

      <ReloadButtonWrapper>
        <ReloadButton onClick={reload}>
          <Refresh />
        </ReloadButton>
      </ReloadButtonWrapper>
    </>
  );
};

const getLabel = (type: UndeletableVoidElementsEnum.HEADER | UndeletableVoidElementsEnum.FOOTER) =>
  type === UndeletableVoidElementsEnum.HEADER ? 'topptekst' : 'bunntekst';
