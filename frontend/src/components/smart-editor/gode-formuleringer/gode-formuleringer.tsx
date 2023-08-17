import { ChevronLeftIcon, LightBulbIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import { focusEditor } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import {
  GodeFormuleringerTitle,
  Header,
  ListContainer,
  StyledGodeFormuleringer,
  StyledSkeleton,
  Top,
} from '@app/components/smart-editor/gode-formuleringer/styles';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useGetTextsQuery } from '@app/redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IRichText, RichTextTypes } from '@app/types/texts/texts';
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

  const editor = useMyPlateEditorRef();
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
    const result: IRichText[] = [];

    for (const text of data) {
      if (text.textType === RichTextTypes.GOD_FORMULERING && filterRegexp.test(text.title)) {
        result.push(text);
      }
    }

    return result;
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

      if (
        event.key === 'Escape' ||
        (event.key.toLowerCase() === 'f' && (event.ctrlKey || event.metaKey) && event.shiftKey)
      ) {
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
          focusEditor(editor);
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
    [editor, filter.length, focused, setShowGodeFormuleringer, texts],
  );

  if (!showGodeFormuleringer) {
    return null;
  }

  return (
    <StyledGodeFormuleringer ref={containerRef} onKeyDown={onKeyDown}>
      <Top>
        <Header>
          <GodeFormuleringerTitle>
            <LightBulbIcon />
            Gode formuleringer ({texts.length})
          </GodeFormuleringerTitle>

          <Button
            title="Skjul gode formuleringer"
            size="small"
            variant="secondary-neutral"
            icon={<ChevronLeftIcon />}
            onClick={() => setShowGodeFormuleringer(false)}
          />
        </Header>
        <Filter filter={filter} setFilter={setFilter} isFocused={focused === -1} onFocus={() => setFocused(-1)} />
      </Top>
      <ListContainer>
        <List texts={texts} isLoading={isLoading} focused={focused} setFocused={setFocused} />
      </ListContainer>
    </StyledGodeFormuleringer>
  );
};

interface ListProps {
  isLoading: boolean;
  texts: IRichText[];
  focused: number;
  setFocused: (index: number) => void;
}

const List = ({ texts, isLoading, focused, setFocused }: ListProps) => {
  if (isLoading) {
    return (
      <>
        <StyledSkeleton variant="rectangle" height={339} />
        <StyledSkeleton variant="rectangle" height={339} />
        <StyledSkeleton variant="rectangle" height={339} />
      </>
    );
  }

  return texts.length === 0 ? (
    <Alert variant="info" size="small">
      Ingen gode formuleringer funnet.
    </Alert>
  ) : (
    texts.map((t, i) => <GodFormulering key={t.id} {...t} isFocused={focused === i} onClick={() => setFocused(i)} />)
  );
};
