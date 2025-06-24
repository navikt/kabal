import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useHeaderFooterQuery } from '@app/components/smart-editor/hooks/use-query';
import { AddNewParagraphAbove, AddNewParagraphBelow } from '@app/plate/components/common/add-new-paragraph-buttons';
import { pxToEm } from '@app/plate/components/get-scaled-em';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@app/plate/plugins/element-types';
import { type FooterElement, type HeaderElement, TextAlign, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { PlainTextTypes } from '@app/types/common-text-types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IConsumerPlainText, IConsumerText } from '@app/types/texts/consumer';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useCallback, useContext, useEffect, useState } from 'react';

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

export const HeaderFooter = (props: PlateElementProps<ElementTypes>) => {
  const { dokumentTypeId } = useContext(SmartEditorContext);

  if (dokumentTypeId === DistribusjonsType.NOTAT) {
    return null;
  }

  return <RenderHeaderFooter {...props} />;
};

const RenderHeaderFooter = (props: PlateElementProps<ElementTypes>) => {
  const { children, element } = props;
  const [initialized, setInitialized] = useState(false);
  const { user } = useContext(StaticDataContext);

  const textType = element.type === ELEMENT_HEADER ? PlainTextTypes.HEADER : PlainTextTypes.FOOTER;

  const [text, setText] = useState<IConsumerPlainText>();

  const [getTexts, { isLoading, isUninitialized }] = useLazyGetConsumerTextsQuery();

  const editor = useMyPlateEditorRef();
  const query = useHeaderFooterQuery(textType);
  const { canManage } = useContext(SmartEditorContext);

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

        editor.tf.setNodes<ElementTypes>(
          { content: mostSpecificText.plainText },
          { match: (n) => n === e, voids: true, at: [] },
        );

        setInitialized(true);
      } catch {
        if (e.content === null) {
          editor.tf.setNodes<ElementTypes>({ content: '' }, { match: (n) => n === e, voids: true, at: [] });
        }
      }
    },
    [editor, getTexts, query, user.ansattEnhet.id],
  );

  useEffect(() => {
    if (!initialized) {
      loadMaltekst(element);
    }
  }, [element, initialized, loadMaltekst]);

  const AddNewParagraph = element.type === ELEMENT_HEADER ? AddNewParagraphBelow : AddNewParagraphAbove;

  return (
    <PlateElement<ElementTypes>
      {...props}
      as="div"
      attributes={{
        ...props.attributes,
        contentEditable: false,
        onDragStart: (event) => event.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
    >
      <SectionContainer data-element={element.type} $sectionType={SectionTypeEnum.FOOTER}>
        <HeaderFooterContent text={text} isLoading={isLoading && isUninitialized} type={element.type} />
        {children}
        {canManage ? (
          <SectionToolbar>
            <AddNewParagraph editor={editor} element={element} />
          </SectionToolbar>
        ) : null}
      </SectionContainer>
    </PlateElement>
  );
};

interface HeaderFooterContentProps {
  text?: IConsumerPlainText;
  isLoading: boolean;
  type: typeof ELEMENT_HEADER | typeof ELEMENT_FOOTER;
}

const HeaderFooterContent = ({ text, isLoading, type }: HeaderFooterContentProps) => {
  const fontSize = type === ELEMENT_FOOTER ? pxToEm(14) : pxToEm(16);

  if (isLoading || text === undefined) {
    return (
      <p style={{ textAlign: TextAlign.LEFT, fontSize }}>
        <Loader />
      </p>
    );
  }

  const { plainText } = text;

  if (plainText === null) {
    return <p style={{ textAlign: TextAlign.LEFT, fontSize }}>Ingen {getLabel(type)} funnet.</p>;
  }

  return <p style={{ textAlign: TextAlign.LEFT, fontSize }}>{plainText}</p>;
};

const getLabel = (type: typeof ELEMENT_HEADER | typeof ELEMENT_FOOTER) =>
  type === ELEMENT_HEADER ? 'topptekst' : 'bunntekst';
