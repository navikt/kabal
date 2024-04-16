import { ChevronLeftIcon, LightBulbIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { focusEditor } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { GodeFormuleringerList } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer-list';
import { SectionSelect } from '@app/components/smart-editor/gode-formuleringer/section-select';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import {
  GodeFormuleringerTitle,
  Header,
  ListContainer,
  StyledGodeFormuleringer,
  Top,
} from '@app/components/smart-editor/gode-formuleringer/styles';
import { GLOBAL, LIST_DELIMITER, NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { getRichText } from '@app/functions/get-translated-content';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import { TemplateSections } from '@app/plate/template-sections';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/common';
import { IPublishedRichText, IPublishedText, IRichText } from '@app/types/texts/responses';
import { useQuery } from '../hooks/use-query';
import { Filter } from './filter';
import { insertGodFormulering } from './insert';

interface Props {
  templateId: TemplateIdEnum;
}

type ActiveSection = TemplateSections | NONE_TYPE;

const filterTemplateSection = (
  templateId: TemplateIdEnum,
  activeSection: ActiveSection,
  godFormulering: IRichText,
): boolean => {
  if (godFormulering.templateSectionIdList.length === 0) {
    return true;
  }

  for (const templateSection of godFormulering.templateSectionIdList) {
    const [template, section] = templateSection.split(LIST_DELIMITER);

    if (
      (template === templateId || template === GLOBAL) &&
      (activeSection === section || activeSection === NONE || section === undefined)
    ) {
      return true;
    }
  }

  return false;
};

const isFilteredPublishedRichText = (
  text: IPublishedText,
  templateId: TemplateIdEnum,
  activeSection: ActiveSection,
): text is IPublishedRichText =>
  text.textType === RichTextTypes.GOD_FORMULERING && filterTemplateSection(templateId, activeSection, text);

export const GodeFormuleringer = ({ templateId }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);
  const [activeSection, setActiveSection] = useState<TemplateSections | NONE_TYPE>(NONE);
  const { language } = useContext(SmartEditorContext);

  const query = useQuery({
    textType: RichTextTypes.GOD_FORMULERING,
    templateId,
    section: activeSection === undefined || activeSection === NONE ? undefined : activeSection,
  });
  const { data = [], isLoading } = useGetConsumerTextsQuery(query);

  useEffect(() => {
    if (focused === -1 && containerRef.current !== null) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [focused]);

  const texts = useMemo(() => {
    if (filter.length === 0) {
      const result: IPublishedRichText[] = [];

      for (const text of data) {
        if (isFilteredPublishedRichText(text, templateId, activeSection)) {
          result.push(text);
        }
      }

      return result;
    }

    const result: [IPublishedRichText, number][] = [];

    for (const text of data) {
      if (isFilteredPublishedRichText(text, templateId, activeSection)) {
        const score = fuzzySearch(splitQuery(filter), text.title + getTextAsString(text, language));

        if (score > 0) {
          result.push([text, score]);
        }
      }
    }

    return result.sort(([, a], [, b]) => b - a).map(([t]) => t);
  }, [filter, data, templateId, activeSection, language]);

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
        (event.key.toLowerCase() === 'g' && (event.ctrlKey || event.metaKey) && event.shiftKey)
      ) {
        event.preventDefault();

        if (focused !== -1) {
          return setFocused(-1);
        }

        if (filter.length !== 0) {
          return setFilter('');
        }

        if (editor !== null) {
          focusEditor(editor);
        }

        return setShowGodeFormuleringer(false);
      }

      if (event.key === 'Enter' && editor !== null) {
        if (focused !== -1) {
          event.preventDefault();

          const text = texts[focused];

          if (text !== undefined) {
            insertGodFormulering(editor, getRichText(language, text.richText));
          }
        }
      }
    },
    [editor, filter.length, focused, language, setShowGodeFormuleringer, texts],
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
        <SectionSelect activeSection={activeSection} setActiveSection={setActiveSection} />
      </Top>
      <ListContainer>
        <GodeFormuleringerList texts={texts} isLoading={isLoading} focused={focused} setFocused={setFocused} />
      </ListContainer>
    </StyledGodeFormuleringer>
  );
};
