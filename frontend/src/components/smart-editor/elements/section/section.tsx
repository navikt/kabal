import React from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { ISectionChildElement, ISectionElement } from '../../../../types/smart-editor';
import { DocumentListElement } from '../document-list/document-list';
import { DynamicElement } from '../dynamic/dynamic';
import { RichTextEditorElement } from '../rich-text/rich-text-editor';
import { SectionTitleElement } from '../section-title/section-title';
import { StaticElement } from '../static/static';
import { TextElement } from '../text/text';

interface Props {
  savedContent: ISectionElement['content'];
  documentId: string;
  onChange: (content: ISectionElement['content']) => void;
}

export const SectionElement = React.memo(
  ({ savedContent, documentId, onChange }: Props) => {
    const { data: oppgave, isLoading } = useOppgave();

    if (isLoading || typeof oppgave === 'undefined') {
      return null;
    }

    const onElementChange = <T extends ISectionChildElement>(content: T['content'], e: T) => {
      const updatedSectionContent: ISectionChildElement[] = savedContent.map((element) => {
        if (e.id === element.id) {
          return { ...e, content };
        }

        return element;
      });

      onChange(updatedSectionContent);
    };

    const elements = savedContent.map((e) => {
      const key = `${documentId}-${e.type}-${e.id}`;

      switch (e.type) {
        case 'section-title':
          return <SectionTitleElement key={key} oppgave={oppgave} element={e} onChange={onElementChange} />;

        case 'rich-text':
          return <RichTextEditorElement key={key} element={e} onChange={onElementChange} />;

        case 'text':
          return <TextElement key={key} element={e} onChange={onElementChange} />;

        case 'label-content':
          return <DynamicElement key={key} oppgave={oppgave} element={e} onChange={onElementChange} />;

        case 'static':
          return <StaticElement key={key} element={e} onChange={onElementChange} />;

        case 'document-list':
          return <DocumentListElement key={key} oppgave={oppgave} element={e} onChange={onElementChange} />;

        default:
          return null;
      }
    });

    return <section>{elements}</section>;
  },
  (prevProps, nextProps) => {
    if (prevProps.documentId !== nextProps.documentId) {
      return false;
    }

    if (prevProps.savedContent === nextProps.savedContent) {
      return true;
    }

    if (prevProps.savedContent.length !== nextProps.savedContent.length) {
      return false;
    }

    return prevProps.savedContent.every((p, i) => {
      const n = nextProps.savedContent[i];

      if (n.id !== p.id) {
        return false;
      }

      if (n.type !== p.type) {
        return false;
      }

      return n.content === p.content;
    });
  }
);

SectionElement.displayName = 'SectionElement';
