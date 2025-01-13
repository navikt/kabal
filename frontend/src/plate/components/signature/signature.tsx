import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { ptToEm, pxToEm } from '@app/plate/components/get-scaled-em';
import { MedunderskriverSignature, SaksbehandlerSignature } from '@app/plate/components/signature/individual-signature';
import type { SignatureElement } from '@app/plate/types';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { type SetNodesOptions, setNodes } from '@udecode/plate-common';
import { PlateElement, type PlateElementProps, useEditorReadOnly } from '@udecode/plate-common/react';
import { type InputHTMLAttributes, useContext } from 'react';
import { styled } from 'styled-components';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const Signature = (props: PlateElementProps<SignatureElement>) => {
  const isReadOnly = useEditorReadOnly();
  const { data: signature } = useGetMySignatureQuery();
  const { data: oppgave } = useOppgave();
  const { canManage, templateId, creator } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);

  if (oppgave === undefined || signature === undefined) {
    return null;
  }

  const isRolAnswers = templateId === TemplateIdEnum.ROL_ANSWERS;

  const hasMedunderskriver = oppgave.medunderskriver.employee !== null;
  const showMedunderskriverCheckbox = hasMedunderskriver && !isRolAnswers;
  const showForkortedeNavnCheckbox = hasMedunderskriver || !signature.anonymous;
  const showSuffixCheckbox = !(signature.anonymous || isRolAnswers);
  const showUseMyNameCheckbox = oppgave.avsluttetAvSaksbehandlerDate === null;

  const hideAll = !(showForkortedeNavnCheckbox || showSuffixCheckbox || hasMedunderskriver);

  const { children, element, editor } = props;
  const overriddenWithSelf = element.overriddenSaksbehandler === user.navIdent;

  const options: SetNodesOptions = { at: [], voids: true, mode: 'lowest', match: (n) => n === element };

  const setSignatureProp = (prop: Partial<SignatureElement>) =>
    setNodes(
      editor,
      { ...prop, overriddenSaksbehandler: overriddenWithSelf ? element.overriddenSaksbehandler : undefined },
      options,
    );

  const setOverriddenSaksbehandler = (overriddenSaksbehandler: string | undefined) =>
    setNodes(editor, { overriddenSaksbehandler }, options);

  return (
    <PlateElement<SignatureElement> {...props} asChild contentEditable={false}>
      <SectionContainer
        data-element={element.type}
        $sectionType={SectionTypeEnum.SIGNATURE}
        onDragStart={(event) => event.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {hideAll || !canManage ? null : (
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

            {showUseMyNameCheckbox ? (
              <Checkbox
                disabled={
                  isReadOnly ||
                  (user.navIdent === creator && (overriddenWithSelf || element.overriddenSaksbehandler === undefined))
                }
                checked={
                  overriddenWithSelf || (user.navIdent === creator && element.overriddenSaksbehandler === undefined)
                }
                onChange={({ target }) => setOverriddenSaksbehandler(target.checked ? user.navIdent : undefined)}
              >
                Signer med mitt navn
              </Checkbox>
            ) : null}
          </Checkboxes>
        )}

        <StyledSignatures>
          <MedunderskriverSignature element={element} />
          <SaksbehandlerSignature element={element} />
        </StyledSignatures>
        {children}
        {canManage ? (
          <SectionToolbar>
            <AddNewParagraphs editor={editor} element={element} />
          </SectionToolbar>
        ) : null}
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
  white-space: nowrap;
  display: flex;
  gap: ${pxToEm(8)};
  padding: ${pxToEm(8)};
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${pxToEm(16)};
  margin-bottom: ${pxToEm(8)};
  flex-wrap: wrap;  
  justify-content: center;
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
