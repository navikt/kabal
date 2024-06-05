import { Select } from '@navikt/ds-react';
import { findNode } from '@udecode/plate-common';
import { useContext, useEffect, useMemo } from 'react';
import { BasePoint, Range } from 'slate';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useTemplateSections } from '@app/hooks/use-template-sections';
import { useSelection } from '@app/plate/hooks/use-selection';
import {
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
} from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import {
  MaltekstElement,
  MaltekstseksjonElement,
  RedigerbarMaltekstElement,
  RegelverkElement,
  RichTextEditor,
  useMyPlateEditorRef,
} from '@app/plate/types';
import { isOfElementTypeFn, isOfElementTypesFn } from '@app/plate/utils/queries';

interface Props {
  activeSection: TemplateSections | NONE_TYPE;
  setActiveSection: (section: TemplateSections | NONE_TYPE) => void;
}

const MATCH = isOfElementTypesFn<MaltekstElement | RedigerbarMaltekstElement | RegelverkElement>([
  ELEMENT_MALTEKST,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
]);
const MATCH_SECTION = isOfElementTypeFn<MaltekstseksjonElement>(ELEMENT_MALTEKSTSEKSJON);
const ANCHOR: BasePoint = { path: [0], offset: 0 };

const getActiveSection = (editor: RichTextEditor, selection: Range): TemplateSections | null => {
  const entry =
    findNode<MaltekstElement | RedigerbarMaltekstElement | RegelverkElement>(editor, {
      at: selection.focus,
      match: MATCH,
    }) ??
    findNode<MaltekstseksjonElement>(editor, {
      at: { anchor: ANCHOR, focus: selection.focus },
      match: MATCH_SECTION,
      reverse: true,
    });

  return entry?.[0]?.section ?? null;
};

export const SectionSelect = ({ activeSection, setActiveSection }: Props) => {
  const { templateId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const selection = useSelection();
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
