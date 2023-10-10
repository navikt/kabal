import { Select } from '@navikt/ds-react';
import { findNode, isElement, useEditorSelection } from '@udecode/plate-common';
import React, { useContext, useEffect, useMemo } from 'react';
import { Range } from 'slate';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useTemplateSections } from '@app/hooks/use-template-sections';
import { TemplateSections } from '@app/plate/template-sections';
import {
  MaltekstElement,
  RedigerbarMaltekstElement,
  RegelverkElement,
  RichTextEditor,
  useMyPlateEditorRef,
} from '@app/plate/types';

interface Props {
  activeSection: TemplateSections | NONE_TYPE;
  setActiveSection: (section: TemplateSections | NONE_TYPE) => void;
}

const getActiveSection = (editor: RichTextEditor, selection: Range): TemplateSections | null => {
  const entry = findNode<MaltekstElement | RedigerbarMaltekstElement | RegelverkElement>(editor, {
    at: selection.anchor ?? [],
    match: (n) => isElement(n) && typeof n['section'] === 'string',
  });

  if (entry === undefined) {
    return null;
  }

  const [{ section }] = entry;

  if (isTemplateSection(section)) {
    return section;
  }

  return null;
};

export const SectionSelect = ({ activeSection, setActiveSection }: Props) => {
  const { templateId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const selection = useEditorSelection();
  const sections = useTemplateSections(templateId);

  useEffect(() => {
    if (selection === null) {
      return;
    }

    const newSection = getActiveSection(editor, selection);

    if (newSection !== null) {
      setActiveSection(newSection);
    }
  }, [editor, selection, setActiveSection]);

  const options = useMemo(
    () => [
      <option key={NONE} value={NONE}>
        Alle gode formuleringer
      </option>,
      ...sections.map((section) => (
        <option key={section} value={section}>
          {MALTEKST_SECTION_NAMES[section]}
        </option>
      )),
    ],
    [sections],
  );

  const value = activeSection === NONE ? NONE : activeSection;

  return (
    <Select
      label="Seksjon"
      size="small"
      hideLabel
      value={value}
      onChange={({ target }) => {
        if (target.value === NONE) {
          setActiveSection(NONE);
        } else if (isTemplateSection(target.value)) {
          setActiveSection(target.value);
        }
      }}
    >
      {options}
    </Select>
  );
};

const isTemplateSection = (section: string): section is TemplateSections =>
  Object.values(TemplateSections).some((templateId) => templateId === section);
