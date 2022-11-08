import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular/TextAddSpaceBefore';
import React, { useCallback, useContext, useEffect } from 'react';
import { Descendant, Editor, Node, Path, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { isNotNull } from '../../../../functions/is-not-type-guards';
import { useLazyGetTextsQuery } from '../../../../redux-api/texts';
import { ApiQuery, RichTextTypes } from '../../../../types/texts/texts';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../../smart-editor/hooks/use-query';
import { createSimpleParagraph } from '../../../smart-editor/templates/helpers';
import { ContentTypeEnum, UndeletableVoidElementsEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { MaltekstElementType, PlaceholderElementType } from '../../types/editor-types';
import { EmptyVoidElement } from '../../types/editor-void-types';
import { RenderElementProps } from '../render-props';

const EMPTY_VOID: EmptyVoidElement = { type: UndeletableVoidElementsEnum.EMPTY_VOID, children: [{ text: '' }] };

export const MaltekstElement = ({ element, children, attributes }: RenderElementProps<MaltekstElementType>) => {
  const editor = useSlateStatic();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({
    textType: RichTextTypes.MALTEKST,
    requiredSection: element.section,
    templateId: templateId ?? undefined,
  });
  const [getTexts, { data }] = useLazyGetTextsQuery();

  const loadMaltekst = useCallback(
    async (q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const maltekster = (await getTexts(q).unwrap())
          .map((t) => (t.textType === RichTextTypes.MALTEKST ? t : null))
          .filter(isNotNull);

        const [nodeEntry] = Editor.nodes(editor, { match: (n) => n === element, voids: false, at: [] });

        if (typeof nodeEntry === 'undefined') {
          return;
        }

        const [node, path] = nodeEntry;

        const nodes: Descendant[] = maltekster.length === 0 ? [EMPTY_VOID] : maltekster.flatMap((m) => m.content);

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
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;
  color: #666;

  &:hover {
    ${StyledButton} {
      opacity: 1;
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
