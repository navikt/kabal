import { GLOBAL, LIST_DELIMITER, NONE, type NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { GodeFormuleringerList } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer-list';
import { HjemlerFilter } from '@app/components/smart-editor/gode-formuleringer/hjemler-filter';
import { SectionSelect } from '@app/components/smart-editor/gode-formuleringer/section-select';
import { SetGlobalExpandState } from '@app/components/smart-editor/gode-formuleringer/set-global-expand-state';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { useTranslatedFormuleringer } from '@app/components/smart-editor/gode-formuleringer/use-translated-formuleringer';
import type { GodeFormuleringerExpandState } from '@app/hooks/settings/use-setting';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import type { TemplateSections } from '@app/plate/template-sections';
import { useMyPlateEditorRef } from '@app/plate/types';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LightBulbIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, VStack } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Filter } from './filter';
import { insertGodFormulering } from './insert';

interface Props {
  templateId: TemplateIdEnum;
}

type ActiveSection = TemplateSections | NONE_TYPE;

const filterTemplateSection = (
  godFormulering: NonNullableGodFormulering,
  templateId: TemplateIdEnum,
  activeSection: ActiveSection,
  selectedHjemler: string[],
): boolean => {
  const hjemler = godFormulering.ytelseHjemmelIdList.map((h) => h.split(LIST_DELIMITER)[1]);

  if (selectedHjemler.length > 0 && !selectedHjemler.some((h) => hjemler.includes(h))) {
    return false;
  }

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

export const GodeFormuleringer = ({ templateId }: Props) => {
  const [selectedHjemler, setSelectedHjemler] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);
  const [activeSection, setActiveSection] = useState<TemplateSections | NONE_TYPE>(NONE);
  const { data, isLoading } = useTranslatedFormuleringer(templateId, activeSection);
  const { godeFormuleringerExpandState } = useContext(SmartEditorContext);

  useEffect(() => {
    if (focused === -1 && containerRef.current !== null) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [focused]);

  const texts = useMemo(() => {
    if (filter.length === 0) {
      const result: NonNullableGodFormulering[] = [];

      for (const text of data) {
        if (filterTemplateSection(text, templateId, activeSection, selectedHjemler)) {
          result.push(text);
        }
      }

      return result.toSorted((a, b) => a.title.localeCompare(b.title));
    }

    const result: [NonNullableGodFormulering, number][] = [];

    for (const text of data) {
      if (filterTemplateSection(text, templateId, activeSection, selectedHjemler)) {
        const score = fuzzySearch(splitQuery(filter), text.title + getTextAsString(text.richText));

        if (score > 0) {
          result.push([text, score]);
        }
      }
    }

    return result.toSorted(([, a], [, b]) => b - a).map(([t]) => t);
  }, [data, filter, templateId, activeSection, selectedHjemler]);

  const [expandState, setExpandState] = useState<Map<string, GodeFormuleringerExpandState>>(
    texts.reduce((acc, t) => acc.set(t.id, godeFormuleringerExpandState), new Map()),
  );

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
    <VStack asChild position="sticky" top="0" gap="4" ref={containerRef} onKeyDown={onKeyDown}>
      <Box as="section" background="bg-default" paddingInline="3 0" paddingBlock="4 0" width="350px" height="100%">
        <VStack gap="2 0" paddingInline="1 4" flexShrink="0">
          <HStack as="header" align="center" justify="space-between" wrap={false}>
            <HStack as="h1" align="center" gap="2" margin="0" className="text-xl" wrap={false}>
              <LightBulbIcon />
              Gode formuleringer ({texts.length})
            </HStack>
            <HStack>
              <SetGlobalExpandState expandState={expandState} />
              <Button
                title="Skjul gode formuleringer"
                size="small"
                variant="tertiary-neutral"
                icon={<XMarkIcon aria-hidden />}
                onClick={() => setShowGodeFormuleringer(false)}
              />
            </HStack>
          </HStack>
          <Filter filter={filter} setFilter={setFilter} isFocused={focused === -1} onFocus={() => setFocused(-1)} />
          <SectionSelect activeSection={activeSection} setActiveSection={setActiveSection} />
          <HjemlerFilter selected={selectedHjemler} setSelected={setSelectedHjemler} />
        </VStack>
        <VStack overflowY="auto" flexGrow="1" gap="4 0" paddingInline="1 4">
          <GodeFormuleringerList
            texts={texts}
            isLoading={isLoading}
            focused={focused}
            setFocused={setFocused}
            expandState={expandState}
            setExpandState={setExpandState}
          />
        </VStack>
      </Box>
    </VStack>
  );
};
