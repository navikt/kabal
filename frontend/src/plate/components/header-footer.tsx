import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, PlateRenderElementProps, setNodes, useEditorReadOnly } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { AddNewParagraphAbove, AddNewParagraphBelow } from '@app/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@app/plate/plugins/element-types';
import { EditorValue, FooterElement, HeaderElement, TextAlign, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { PlainTextTypes } from '@app/types/common-text-types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IConsumerPlainText, IConsumerText } from '@app/types/texts/consumer';

const lexSpecialis = (enhetId: string, texts: IConsumerPlainText[]): IConsumerPlainText | null => {
  const sorted = texts
    .filter((t) => t.enhetIdList.includes(enhetId))
    .sort((a, b) => b.enhetIdList.length - a.enhetIdList.length);

  const [first] = sorted;

  return first ?? null;
};

const isPlainText = (text: IConsumerText): text is IConsumerPlainText =>
  text.textType === PlainTextTypes.HEADER || text.textType === PlainTextTypes.FOOTER;

type ElementTypes = HeaderElement | FooterElement;

export const HeaderFooter = (props: PlateRenderElementProps<EditorValue, ElementTypes>) => {
  const { dokumentTypeId } = useContext(SmartEditorContext);

  if (dokumentTypeId === DistribusjonsType.NOTAT) {
    return null;
  }

  return <RenderHeaderFooter {...props} />;
};

const RenderHeaderFooter = ({ element, attributes, children }: PlateRenderElementProps<EditorValue, ElementTypes>) => {
  const editor = useMyPlateEditorRef();
  const readOnly = useEditorReadOnly(editor.id);
  const language = useSmartEditorLanguage();
  const [initialized, setInitialized] = useState(false);
  const { user } = useContext(StaticDataContext);

  const textType = element.type === ELEMENT_HEADER ? PlainTextTypes.HEADER : PlainTextTypes.FOOTER;

  const [text, setText] = useState<IConsumerPlainText | undefined>(
    element.content === null
      ? undefined
      : {
          textType,
          plainText: element.content,
          language,
          enhetIdList: [],
          id: '',
          publishedDateTime: '',
          templateSectionIdList: [],
          title: '',
          utfallIdList: [],
          ytelseHjemmelIdList: [],
        },
  );

  const [getTexts, { isLoading, isUninitialized }] = useLazyGetConsumerTextsQuery();

  const query = useQuery({ textType });

  const loadMaltekst = useCallback(
    async (e: ElementTypes) => {
      if (query === skipToken) {
        return;
      }

      try {
        const texts = (await getTexts(query).unwrap()).filter(isPlainText);
        const mostSpecificText = lexSpecialis(user.ansattEnhet.id, texts);

        if (mostSpecificText === null) {
          return;
        }

        setText(mostSpecificText);

        setNodes<ElementTypes>(
          editor,
          { content: mostSpecificText.plainText },
          { match: (n) => n === e, voids: true, at: [] },
        );

        setInitialized(true);
      } catch {
        if (e.content === null) {
          setNodes<ElementTypes>(editor, { content: '' }, { match: (n) => n === e, voids: true, at: [] });
        }
      }
    },
    [editor, getTexts, query, user.ansattEnhet.id],
  );

  useEffect(() => {
    if (!initialized && !readOnly) {
      loadMaltekst(element);
    }
  }, [element, initialized, loadMaltekst, readOnly, textType, user.ansattEnhet.id]);

  const AddNewParagraph = element.type === ELEMENT_HEADER ? AddNewParagraphBelow : AddNewParagraphAbove;

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={false}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <SectionContainer data-element={element.type} $sectionType={SectionTypeEnum.FOOTER}>
        <HeaderFooterContent
          text={text}
          isLoading={isLoading && isUninitialized}
          type={element.type}
          readonly={readOnly}
        />
        {children}
        <SectionToolbar>
          <AddNewParagraph editor={editor} element={element} />
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

interface HeaderFooterContentProps {
  text?: IConsumerPlainText;
  isLoading: boolean;
  type: typeof ELEMENT_HEADER | typeof ELEMENT_FOOTER;
  readonly: boolean;
}

const HeaderFooterContent = ({ text, isLoading, type, readonly }: HeaderFooterContentProps) => {
  if (isLoading || text === undefined) {
    if (readonly) {
      return null;
    }

    return (
      <Paragraph $textAlign={TextAlign.LEFT}>
        <Loader />
      </Paragraph>
    );
  }

  const { plainText } = text;

  if (plainText === null) {
    return <Paragraph $textAlign={TextAlign.LEFT}>Ingen {getLabel(type)} funnet.</Paragraph>;
  }

  return <Paragraph $textAlign={TextAlign.LEFT}>{plainText}</Paragraph>;
};

const getLabel = (type: typeof ELEMENT_HEADER | typeof ELEMENT_FOOTER) =>
  type === ELEMENT_HEADER ? 'topptekst' : 'bunntekst';

const Paragraph = styled.p<{ $textAlign: TextAlign }>`
  text-align: ${({ $textAlign }) => $textAlign};
`;
