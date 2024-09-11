import { PlateElement, PlateRenderElementProps, setNodes, useEditorReadOnly } from '@udecode/plate-common';
import { InputHTMLAttributes, useContext } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { ptToEm, pxToEm } from '@app/plate/components/get-scaled-em';
import { MedunderskriverSignature, SaksbehandlerSignature } from '@app/plate/components/signature/individual-signature';
import { EditorValue, SignatureElement } from '@app/plate/types';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

export const Signature = ({
  element,
  attributes,
  children,
  editor,
}: PlateRenderElementProps<EditorValue, SignatureElement>) => {
  const isReadOnly = useEditorReadOnly();
  const { data: signature } = useGetMySignatureQuery();
  const { data: oppgave } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);

  if (oppgave === undefined || signature === undefined) {
    return null;
  }

  const isRolAnswers = templateId === TemplateIdEnum.ROL_ANSWERS;

  const hasMedunderskriver = oppgave.medunderskriver.employee !== null;
  const showMedunderskriverCheckbox = hasMedunderskriver && !isRolAnswers;
  const showForkortedeNavnCheckbox = hasMedunderskriver || !signature.anonymous;
  const showSuffixCheckbox = !signature.anonymous && !isRolAnswers;

  const hideAll = !showForkortedeNavnCheckbox && !showSuffixCheckbox && !hasMedunderskriver;

  const setSignatureProp = (prop: Partial<SignatureElement>) =>
    setNodes(editor, { ...element, ...prop }, { at: [], voids: true, mode: 'lowest', match: (n) => n === element });

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <SectionContainer
        data-element={element.type}
        $sectionType={SectionTypeEnum.SIGNATURE}
        onDragStart={(event) => event.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {hideAll ? null : (
          <Checkboxes>
            {showForkortedeNavnCheckbox ? (
              <Checkbox
                disabled={isReadOnly}
                checked={element.useShortName}
                onChange={({ target }) => setSignatureProp({ useShortName: target.checked })}
              >
                Bruk forkortede navn
              </Checkbox>
            ) : null}

            {showMedunderskriverCheckbox ? (
              <Checkbox
                disabled={isReadOnly}
                checked={element.includeMedunderskriver}
                onChange={({ target }) => setSignatureProp({ includeMedunderskriver: target.checked })}
              >
                Inkluder medunderskriver
              </Checkbox>
            ) : null}

            {showSuffixCheckbox ? (
              <Checkbox
                disabled={isReadOnly || signature?.anonymous === true}
                checked={element.useSuffix}
                onChange={({ target }) => setSignatureProp({ useSuffix: target.checked })}
              >
                Bruk «/saksbehandler»-tittel
              </Checkbox>
            ) : null}
          </Checkboxes>
        )}

        <StyledSignatures>
          <MedunderskriverSignature element={element} />
          <SaksbehandlerSignature element={element} />
        </StyledSignatures>
        {children}
        <SectionToolbar>
          <AddNewParagraphs editor={editor} element={element} />
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: string;
}

const Checkbox = ({ children, ...props }: CheckboxProps) => (
  <StyledLabel>
    <StyledCheckbox {...props} type="checkbox" />
    {children}
  </StyledLabel>
);

const StyledLabel = styled.label`
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: ${pxToEm(8)};
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  width: 1.2em;
  height: 1.2em;
`;

const Checkboxes = styled.div`
  user-select: none;
  border-style: dashed;
  border-radius: var(--a-border-radius-medium);
  border-width: ${ptToEm(2)};
  width: min-content;
  white-space: nowrap;
  display: flex;
  gap: ${pxToEm(8)};
  padding: ${pxToEm(8)};
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${pxToEm(16)};
  margin-bottom: ${pxToEm(8)};
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
