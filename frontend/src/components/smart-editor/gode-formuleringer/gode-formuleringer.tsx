import { GLOBAL, LIST_DELIMITER, NONE, type NONE_TYPE } from '@app/components/smart-editor-texts/types';
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
import { useTranslatedFormuleringer } from '@app/components/smart-editor/gode-formuleringer/use-translated-formuleringer';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import type { TemplateSections } from '@app/plate/template-sections';
import { useMyPlateEditorRef } from '@app/plate/types';
import { GOD_FORMULERING_TYPE } from '@app/types/common-text-types';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { IConsumerText, NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LightBulbIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Filter } from './filter';
import { insertGodFormulering } from './insert';

interface Props {
  templateId: TemplateIdEnum;
}

type ActiveSection = TemplateSections | NONE_TYPE;

const filterTemplateSection = (
  templateId: TemplateIdEnum,
  activeSection: ActiveSection,
  godFormulering: IConsumerText,
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
  text: NonNullableGodFormulering,
  templateId: TemplateIdEnum,
  activeSection: ActiveSection,
) => text.textType === GOD_FORMULERING_TYPE && filterTemplateSection(templateId, activeSection, text);

export const GodeFormuleringer = ({ templateId }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);
  const [activeSection, setActiveSection] = useState<TemplateSections | NONE_TYPE>(NONE);
  const { data, isLoading } = useTranslatedFormuleringer(templateId, activeSection);

  useEffect(() => {
    if (focused === -1 && containerRef.current !== null) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [focused]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const texts = useMemo(() => {
    if (filter.length === 0) {
      const result: NonNullableGodFormulering[] = [];

      for (const text of data) {
        if (isFilteredPublishedRichText(text, templateId, activeSection)) {
          result.push(text);
        }
      }

      return result.toSorted((a, b) => a.title.localeCompare(b.title));
    }

    const result: [NonNullableGodFormulering, number][] = [];

    for (const text of data) {
      if (isFilteredPublishedRichText(text, templateId, activeSection)) {
        const score = fuzzySearch(splitQuery(filter), text.title + getTextAsString(text.richText));

        if (score > 0) {
          result.push([text, score]);
        }
      }
    }

    return result.toSorted(([, a], [, b]) => b - a).map(([t]) => t);
  }, [data, filter, templateId, activeSection]);

  const onKeyDown = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
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

        if (filter.length > 0) {
          return setFilter('');
        }

        if (editor !== null) {
          editor.tf.focus();
        }

        return setShowGodeFormuleringer(false);
      }

      if (event.key === 'Enter' && editor !== null && focused !== -1) {
        event.preventDefault();

        const text = texts[focused];

        if (text !== undefined) {
          insertGodFormulering(editor, text.richText);
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
            variant="tertiary-neutral"
            icon={<XMarkIcon aria-hidden />}
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
