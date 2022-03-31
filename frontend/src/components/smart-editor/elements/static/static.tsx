import React, { useEffect, useMemo } from 'react';
import { Descendant, Element } from 'slate';
import styled from 'styled-components';
import { IStaticElement } from '../../../../types/smart-editor';
import { ContentTypeEnum, HeadingTypesEnum, TextAlignEnum } from '../../editor-types';
import { renderElement } from '../../slate-elements';
import { renderLeaf } from '../rich-text/leaf/render';

type Content = IStaticElement['content'];

interface Props {
  element: IStaticElement;
  onChange: (value: Content, element: IStaticElement) => void;
}

export const StaticElement = React.memo(
  ({ element, onChange }: Props) => {
    const content = getStaticContent(element);

    useEffect(() => {
      if (typeof element.content === 'undefined') {
        onChange(content, element);
        return;
      }

      if (element.content === content) {
        return;
      }

      if (element.content.length !== content.length) {
        onChange(content, element);
        return;
      }

      const areUnequal = element.content.every((e, i) => {
        const c = content[i];

        if (e.type !== c.type) {
          return true;
        }

        if (!Array.isArray(e.children)) {
          return true;
        }

        if (c.children.length !== e.children.length) {
          return true;
        }

        return false;
      });

      if (areUnequal) {
        onChange(content, element);
        return;
      }

      const isEqual = JSON.stringify(element.content) === JSON.stringify(content);

      if (!isEqual) {
        onChange(content, element);
      }
    }, [content, element, onChange]);

    const children = useMemo(() => renderTemplateElement(content), [content]);

    return <Container>{children}</Container>;
  },
  (prevProps, nextProps) =>
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.type === nextProps.element.type &&
    prevProps.element.source === nextProps.element.source &&
    prevProps.element.content === nextProps.element.content
);

StaticElement.displayName = 'StaticElement';

const Container = styled.div`
  padding-left: 16px;
`;

const renderTemplateElement = (elements: Descendant[]): JSX.Element[] =>
  elements.map((e, i) => {
    if (Element.isElement(e)) {
      return renderElement({
        key: i,
        element: e,
        children: renderTemplateElement(e.children),
        attributes: {
          'data-slate-node': 'element',
          ref: undefined,
        },
      });
    }

    return (
      <React.Fragment key={i}>
        {renderLeaf({
          leaf: e,
          children: e.text,
          text: e,
          attributes: {
            'data-slate-leaf': true,
          },
        })}
      </React.Fragment>
    );
  });

const getStaticContent = ({ source }: IStaticElement): Element[] => {
  if (source === 'regards') {
    return [
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [{ text: 'Med vennlig hilsen\nNAV Klageinstans' }],
      },
    ];
  }

  if (source === 'questions') {
    return [
      {
        type: HeadingTypesEnum.HEADING_ONE,
        children: [{ text: 'Har du spørsmål?' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          {
            text: 'Du finner mer informasjon på nav.no. Hvis du ikke finner svar på spørsmålet ditt, kontakt oss på nav.no/kontakt.',
          },
        ],
      },
    ];
  }

  if (source === 'anke') {
    return [
      {
        type: HeadingTypesEnum.HEADING_ONE,
        children: [{ text: 'Du har rett til å anke' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          {
            text: 'Hvis du mener dette vedtaket er feil, kan du anke til Trygderetten innen seks uker fra den datoen vedtaket kom fram til deg. Du finner informasjon, skjema og første side for innsending på www.nav.no/klage. Velg NAV Klageinstans [avdeling].',
          },
        ],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [{ text: 'Anken må være underskrevet av deg.' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          { text: 'I trygdesaker må du først anke til Trygderetten før du kan ta saken videre til lagmannsretten.' },
        ],
      },
    ];
  }

  return [];
};
