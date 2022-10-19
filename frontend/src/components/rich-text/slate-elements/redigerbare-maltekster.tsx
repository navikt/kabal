import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useCallback, useContext, useEffect } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import { useLazyGetTextsQuery } from '../../../redux-api/texts';
import { ApiQuery, TextTypes } from '../../../types/texts/texts';
import { SmartEditorContext } from '../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../smart-editor/hooks/use-query';
import { createSimpleParagraph } from '../../smart-editor/templates/helpers';
import { RedigerbareMalteksterElementType } from '../types/editor-types';
import { RenderElementProps } from './render-props';

export const RedigerbareMalteskterElement = ({
  element,
  children,
  textType,
}: RenderElementProps<RedigerbareMalteksterElementType> & { textType: TextTypes }) => {
  const editor = useSlateStatic();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({
    textType,
    requiredSection: element.section,
    templateId: templateId ?? undefined,
  });
  const [getTexts] = useLazyGetTextsQuery();

  const load = useCallback(
    async (e: RedigerbareMalteksterElementType, q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const redigerbareMaltekster = await getTexts(q).unwrap();

        const [nodeEntry] = Editor.nodes(editor, { match: (n) => n === e, voids: false, at: [] });

        if (typeof nodeEntry === 'undefined') {
          return;
        }

        const nodes =
          redigerbareMaltekster.length === 0
            ? [createSimpleParagraph()]
            : redigerbareMaltekster.flatMap((r) => r.content);

        Transforms.insertNodes<RedigerbareMalteksterElementType>(editor, nodes, {
          match: (n) => n === e,
          voids: false,
          at: nodeEntry[1],
        });
      } catch (err) {
        console.error('Failed to get redigerbare maltekster.', err);
        Transforms.insertNodes<RedigerbareMalteksterElementType>(editor, [createSimpleParagraph()], {
          match: (n) => n === e,
          voids: false,
          at: [],
        });
      }

      Transforms.removeNodes(editor, { match: (n) => n === e, voids: false, at: [] });
    },
    [editor, getTexts]
  );

  useEffect(() => {
    load(element, query);
  }, [element, load, query]);

  return children;
};
