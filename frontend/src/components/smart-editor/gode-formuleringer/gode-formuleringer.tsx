import { Back, LightBulb } from '@navikt/ds-icons';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useGetTextsQuery } from '@app/redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IRichText, RichTextTypes } from '@app/types/texts/texts';
import { SmartEditorContext } from '../context/smart-editor-context';
import { useQuery } from '../hooks/use-query';
import { Filter } from './filter';
import { GodFormulering } from './god-formulering';
import { insertGodFormulering } from './insert';

interface Props {
  templateId: TemplateIdEnum | NoTemplateIdEnum;
}

export const GodeFormuleringer = ({ templateId }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useSlateStatic();
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);
  const query = useQuery({ textType: RichTextTypes.GOD_FORMULERING, templateId });
  const { data = [], isLoading } = useGetTextsQuery(query);

  useEffect(() => {
    if (focused === -1 && containerRef.current !== null) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [focused]);

  const texts: IRichText[] = useMemo(() => {
    const filterRegexp = stringToRegExp(filter);

    return data
      .filter(({ title }) => filterRegexp.test(title))
      .map((t) => (t.textType !== RichTextTypes.GOD_FORMULERING ? null : t))
      .filter(isNotNull);
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

  if (!showGodeFormuleringer || isLoading || typeof data === 'undefined' || editor === null) {
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
          <LightBulb />
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
