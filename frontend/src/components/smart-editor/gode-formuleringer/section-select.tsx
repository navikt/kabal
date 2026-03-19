import { Select } from '@navikt/ds-react';
import { useContext, useEffect, useMemo } from 'react';
import type { Range } from 'slate';
import { MALTEKST_SECTION_NAMES } from '@/components/smart-editor/constants';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { NONE, type NONE_TYPE } from '@/components/smart-editor-texts/types';
import { useTemplateSections } from '@/hooks/use-template-sections';
import { useSelection } from '@/plate/hooks/use-selection';
import { ELEMENT_MALTEKSTSEKSJON } from '@/plate/plugins/element-types';
import { TemplateSections } from '@/plate/template-sections';
import { type MaltekstseksjonElement, type RichTextEditor, useMyPlateEditorRef } from '@/plate/types';
import { isOfElementTypeFn } from '@/plate/utils/queries';

interface Props {
  activeSection: TemplateSections | NONE_TYPE;
  setActiveSection: (section: TemplateSections | NONE_TYPE) => void;
}

const MATCH_SECTION = isOfElementTypeFn<MaltekstseksjonElement>(ELEMENT_MALTEKSTSEKSJON);

const getActiveSection = (editor: RichTextEditor, selection: Range): TemplateSections | NONE_TYPE => {
  const entry = editor.api.node<MaltekstseksjonElement>({
    at: selection.focus,
    match: MATCH_SECTION,
    reverse: true,
  });

  return entry?.[0]?.section ?? NONE;
};

export const SectionSelect = ({ activeSection, setActiveSection }: Props) => {
  const { templateId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const selection = useSelection();

  const { used } = useTemplateSections(templateId);

  useEffect(() => {
    if (selection === null) {
      return;
    }

    setActiveSection(getActiveSection(editor, selection));
  }, [editor, selection, setActiveSection]);

  const options = useMemo(
    () => [
      <option key={NONE} value={NONE}>
        Alle gode formuleringer
      </option>,
      ...used.map((section) => (
        <option key={section} value={section}>
          {MALTEKST_SECTION_NAMES[section]}
        </option>
      )),
    ],
    [used],
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
