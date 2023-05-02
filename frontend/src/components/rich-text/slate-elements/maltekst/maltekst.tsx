import { Button, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular/TextAddSpaceBefore';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Descendant, Editor, Node, Path, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { ApiQuery, RichTextTypes, TemplateSections } from '@app/types/texts/texts';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../../smart-editor/hooks/use-query';
import { createSimpleParagraph } from '../../../smart-editor/templates/helpers';
import { ContentTypeEnum, UndeletableVoidElementsEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { MaltekstElementType, PlaceholderElementType } from '../../types/editor-types';
import { EmptyVoidElement } from '../../types/editor-void-types';
import { RenderElementProps } from '../render-props';
import { lexSpecialis } from './lex-specialis';

const EMPTY_VOID: EmptyVoidElement = { type: UndeletableVoidElementsEnum.EMPTY_VOID, children: [{ text: '' }] };

export const MaltekstElement = ({ element, children, attributes }: RenderElementProps<MaltekstElementType>) => {
  const editor = useSlateStatic();
  const { templateId } = useContext(SmartEditorContext);
  const sections = useMemo<(TemplateSections | NONE_TYPE)[]>(() => [element.section, NONE], [element.section]);
  const query = useQuery({ textType: RichTextTypes.MALTEKST, sections, templateId });
  const [getTexts, { data }] = useLazyGetTextsQuery();
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMaltekst = useCallback(
    async (q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const maltekst = lexSpecialis(
          (await getTexts(q).unwrap()).map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null)).filter(isNotNull)
        );

        const [nodeEntry] = Editor.nodes(editor, { match: (n) => n === element, voids: false, at: [] });

        if (typeof nodeEntry === 'undefined') {
          return;
        }

        const [node, path] = nodeEntry;

        const nodes: Descendant[] = maltekst === null ? [EMPTY_VOID] : maltekst.content;

        if (Node.isNodeList(node.children) && nodesEquals(node.children, nodes)) {
          return;
        }

        HistoryEditor.withoutSaving(editor, () => {
          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, {
              match: (n) => n === element,
              voids: false,
              at: path,
            });

            Transforms.insertNodes<MaltekstElementType>(
              editor,
              { ...element, children: nodes },
              {
                match: (n) => n === element,
                voids: false,
                at: path,
              }
            );
          });
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to get maltekster.', err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, getTexts]
  );

  useEffect(() => {
    loadMaltekst(query);
  }, [loadMaltekst, query]);

  const addParagraph = () => {
    const path = ReactEditor.findPath(editor, element);
    const at = Path.next(path);
    Transforms.insertNodes(editor, createSimpleParagraph(), { at });
    Transforms.select(editor, at);
  };

  const contentEditable = data?.length !== 0;

  return (
    <Container
      {...attributes}
      onDragStart={(e) => e.preventDefault()}
      contentEditable={contentEditable}
      suppressContentEditableWarning={contentEditable}
    >
      {isLoaded ? <Loader size="xsmall" /> : null}
      {children}
      <StyledButton
        contentEditable={false}
        onClick={addParagraph}
        title="Legg til nytt avsnitt under"
        icon={<TextAddSpaceBefore size={24} />}
        variant="tertiary"
        size="xsmall"
      />
    </Container>
  );
};

MaltekstElement.displayName = 'MaltekstElement';

const StyledButton = styled(Button)`
  position: absolute;
  left: -36pt;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: inherit;
  flex-direction: inherit;
  row-gap: inherit;
  position: relative;
  color: #666;

  ::before {
    content: '';
    position: absolute;
    left: -12pt;
    width: 6pt;
    height: 0;
    top: 0;
    background-color: var(--a-bg-subtle);
    transition: height 0.4s ease-in-out;
  }

  :hover {
    ${StyledButton} {
      opacity: 1;
    }

    ::before {
      height: 100%;
    }
  }
`;

const nodesEquals = (a: Descendant[], b: Descendant[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const equals = a.every((n, i) => {
    const n2 = b[i];

    if (n2 === undefined) {
      return false;
    }

    if (Text.isText(n)) {
      if (!Text.isText(n2)) {
        return false;
      }

      return n.text === n2.text;
    }

    if (n.type !== n2.type) {
      return false;
    }

    if (isOfElementType<PlaceholderElementType>(n, ContentTypeEnum.PLACEHOLDER)) {
      return true;
    }

    if (Node.isNodeList(n2.children)) {
      return nodesEquals(n.children, n2.children);
    }

    return false;
  });

  return equals;
};
