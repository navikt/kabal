import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateElement, PlateRenderElementProps, setNodes } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { AddNewParagraphAbove, AddNewParagraphBelow } from '@app/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@app/plate/plugins/element-types';
import { EditorValue, FooterElement, HeaderElement, TextAlign, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { useUser } from '@app/simple-api-state/use-user';
import { DistribusjonsType } from '@app/types/documents/documents';
import { ApiQuery, IPlainText, IText, PlainTextTypes } from '@app/types/texts/texts';

const lexSpecialis = (texts: IPlainText[]): IPlainText | null => {
  const sorted = texts.sort((a, b) => b.enheter.length - a.enheter.length);

  const [first] = sorted;

  return first ?? null;
};

const isPlainText = (text: IText): text is IPlainText =>
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
  const [initialized, setInitialized] = useState(false);
  const { data: user } = useUser();

  const textType = element.type === ELEMENT_HEADER ? PlainTextTypes.HEADER : PlainTextTypes.FOOTER;

  const query = useMemo(
    () => (user === undefined ? skipToken : { enheter: [user.ansattEnhet.id], textType }),
    [textType, user],
  );

  const [text, setText] = useState<IPlainText>();

  const [getTexts, { isLoading, isUninitialized }] = useLazyGetTextsQuery();

  const editor = useMyPlateEditorRef();

  const loadMaltekst = useCallback(
    async (e: ElementTypes, q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const mostSpecificText = lexSpecialis((await getTexts(q).unwrap()).filter(isPlainText));

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
    [editor, getTexts],
  );

  useEffect(() => {
    if (!initialized) {
      loadMaltekst(element, query);
    }
  }, [element, initialized, loadMaltekst, query]);

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
        <HeaderFooterContent text={text} isLoading={isLoading && isUninitialized} type={element.type} />
        {children}
        <SectionToolbar>
          <AddNewParagraph editor={editor} element={element} />
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

interface HeaderFooterContentProps {
  text?: IPlainText;
  isLoading: boolean;
  type: typeof ELEMENT_HEADER | typeof ELEMENT_FOOTER;
}

const HeaderFooterContent = ({ text, isLoading, type }: HeaderFooterContentProps) => {
  if (isLoading || typeof text === 'undefined') {
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
