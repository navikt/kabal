import { Back, Law } from '@navikt/ds-icons';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReactEditor } from 'slate-react';
import styled from 'styled-components';
import { stringToRegExp } from '../../../functions/string-to-regex';
import { useFeatureToggle } from '../../../hooks/use-feature-toggle';
import { FeatureToggles } from '../../../redux-api/feature-toggling';
import { useGetTextsQuery } from '../../../redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { TextTypes } from '../../../types/texts/texts';
import { SmartEditorContext } from '../context/smart-editor-context';
import { useQuery } from '../hooks/use-query';
import { Filter } from './filter';
import { GodFormulering } from './god-formulering';
import { insertGodFormulering } from './insert';

interface Props {
  templateId: TemplateIdEnum | NoTemplateIdEnum;
}

export const GodeFormuleringer = ({ templateId }: Props) => {
  const enabled = true; //useFeatureToggle(FeatureToggles.MALTEKSTER);

  const [filter, setFilter] = useState<string>('');
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { showGodeFormuleringer, setShowGodeFormuleringer, editor } = useContext(SmartEditorContext);
  const query = useQuery({ textType: TextTypes.GOD_FORMULERING, templateId });
  const { data, isLoading } = useGetTextsQuery(query);

  useEffect(() => {
    if (focused === -1 && containerRef.current !== null) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [focused]);

  const texts = useMemo(() => {
    const filterRegexp = stringToRegExp(filter);
    return data?.filter(({ title }) => filterRegexp.test(title)) ?? [];
  }, [data, filter]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        setFocused((f) => Math.min(texts.length - 1, f + 1));
        event.preventDefault();
        return;
      }

      if (event.key === 'ArrowUp') {
        setFocused((f) => Math.max(-1, f - 1));
        event.preventDefault();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();

        if (focused !== -1) {
          setFocused(-1);
          return;
        }

        if (filter.length !== 0) {
          setFilter('');
          return;
        }

        if (editor !== null) {
          ReactEditor.focus(editor);
        }

        setShowGodeFormuleringer(false);

        return;
      }

      if (event.key === 'Enter' && editor !== null) {
        if (focused !== -1) {
          event.preventDefault();

          const text = texts[focused];

          if (text !== undefined) {
            insertGodFormulering(editor, text.content);
          }
        }
      }
    },
    [editor, filter.length, focused, setShowGodeFormuleringer, texts]
  );

  if (!showGodeFormuleringer || isLoading || typeof data === 'undefined' || editor === null || !enabled) {
    return null;
  }

  const godeFormuleringer =
    texts.length === 0 ? (
      <span>Ingen gode formuleringer funnet.</span>
    ) : (
      texts.map((t, i) => (
        <GodFormulering key={t.id} {...t} isFocused={focused === i} editor={editor} onClick={() => setFocused(i)} />
      ))
    );

  return (
    <StyledGodeFormuleringer ref={containerRef} onKeyDown={onKeyDown}>
      <Header>
        <GodeFormuleringerTitle>
          <Law />
          Gode formuleringer ({texts.length})
        </GodeFormuleringerTitle>

        <StyledCloseButton title="Skjul gode formuleringer" onClick={() => setShowGodeFormuleringer(false)}>
          <Back />
        </StyledCloseButton>
      </Header>
      <Filter filter={filter} setFilter={setFilter} isFocused={focused === -1} onFocus={() => setFocused(-1)} />
      {godeFormuleringer}
    </StyledGodeFormuleringer>
  );
};

const StyledGodeFormuleringer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 320px;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 20px;
  padding-left: 0;
  cursor: pointer;
`;

const GodeFormuleringerTitle = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
`;
