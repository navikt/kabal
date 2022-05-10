import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useEffect } from 'react';
import { Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { useLazyGetTextsQuery } from '../../../../redux-api/texts';
import { ApiQuery, TextTypes } from '../../../../types/texts/texts';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { useQuery } from '../../../smart-editor/hooks';
import { MaltekstElementType } from '../../types/editor-void-types';
import { voidStyle } from '../style';
import { MaltekstContent } from './maltekst-content';

interface Props {
  element: MaltekstElementType;
}

export const MaltekstElement = ({ element }: Props) => {
  const editor = useSlateStatic();
  const { showMaltekstTags, activeElement, templateId } = useContext(SmartEditorContext);
  const query = useQuery({
    textType: TextTypes.MALTEKST,
    requiredSection: element.section,
    templateId: templateId ?? undefined,
  });
  const [getTexts, { isLoading, isUninitialized }] = useLazyGetTextsQuery();

  const loadMaltekst = useCallback(
    async (e: MaltekstElementType, q: ApiQuery | typeof skipToken) => {
      if (q === skipToken) {
        return;
      }

      try {
        const content = await getTexts(q).unwrap();

        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes<MaltekstElementType>(editor, { content }, { match: (n) => n === e, voids: true, at: [] });
        });
      } catch {
        if (e.content === null) {
          HistoryEditor.withoutSaving(editor, () => {
            Transforms.setNodes<MaltekstElementType>(
              editor,
              { content: [] },
              { match: (n) => n === e, voids: true, at: [] }
            );
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
      <MaltekstContent
        element={element}
        query={query}
        isLoading={isLoading && isUninitialized}
        reload={() => loadMaltekst(element, query)}
      />
    </MaltekstContainer>
  );
};

interface MaltekstContainerProps {
  isActive: boolean;
  showTags: boolean;
}

const getColor = ({ isActive, showTags }: MaltekstContainerProps) => {
  if (showTags && !isActive) {
    return '#e9f1fc';
  }

  return 'transparent';
};

const MaltekstContainer = styled.div<MaltekstContainerProps>`
  position: relative;
  ${voidStyle}
  border-radius: 2px;
  transition-property: background-color, outline-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  background-color: ${getColor};
  outline-color: ${getColor};
  outline-style: solid;
  outline-width: 8px;
`;
