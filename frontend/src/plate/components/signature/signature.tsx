import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { ptToEm, pxToEm } from '@app/plate/components/get-scaled-em';
import { MedunderskriverSignature, SaksbehandlerSignature } from '@app/plate/components/signature/individual-signature';
import type { SignatureElement } from '@app/plate/types';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { HStack } from '@navikt/ds-react';
import { useEditorReadOnly } from '@platejs/core/react';
import type { SetNodesOptions } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useContext, useId } from 'react';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

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

  const { children, element, editor } = props;
  const hasMedunderskriver = oppgave.medunderskriver.employee !== null;
  const showMedunderskriverCheckbox = hasMedunderskriver && !isRolAnswers;
  const showForkortedeNavnCheckbox = element.includeMedunderskriver || !signature.anonymous;
  const showSuffixCheckbox = !(signature.anonymous || isRolAnswers);
  const showUseMyNameCheckbox = oppgave.avsluttetAvSaksbehandlerDate !== null;
  const showEnableCheckbox =
    templateId === TemplateIdEnum.NOTAT ||
    templateId === TemplateIdEnum.GENERELT_BREV ||
    templateId === TemplateIdEnum.ETTERSENDING_TIL_TRYGDERETTEN;

  const hideAll = !(showForkortedeNavnCheckbox || showSuffixCheckbox || hasMedunderskriver);

  const overriddenWithSelf = element.overriddenSaksbehandler === user.navIdent;

  const options: SetNodesOptions = { at: [], voids: true, mode: 'lowest', match: (n) => n === element };

  const setSignatureProp = (prop: Partial<SignatureElement>) =>
    editor.tf.setNodes(
      { ...prop, overriddenSaksbehandler: overriddenWithSelf ? element.overriddenSaksbehandler : undefined },
      options,
    );

  const setOverriddenSaksbehandler = (overriddenSaksbehandler: string | undefined) =>
    editor.tf.setNodes({ overriddenSaksbehandler }, options);

  const disabledCheckbox = element.enabled === false || isReadOnly;

  return (
    <PlateElement<SignatureElement> {...props} attributes={{ ...props.attributes, contentEditable: false }}>
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
          <HStack
            marginInline="auto"
            wrap
            justify="center"
            className="select-none self-center whitespace-nowrap rounded-medium border-dashed"
            style={{
              marginTop: pxToEm(16),
              marginBottom: pxToEm(8),
              borderWidth: ptToEm(2),
              padding: pxToEm(8),
              gap: pxToEm(8),
            }}
          >
            {showEnableCheckbox ? (
              <Checkbox
                disabled={isReadOnly}
                checked={element.enabled}
                onChange={(enabled) => setSignatureProp({ enabled })}
              >
                Inkluder signatur
              </Checkbox>
            ) : null}

            {showForkortedeNavnCheckbox ? (
              <Checkbox
                disabled={disabledCheckbox}
                checked={element.useShortName}
                onChange={(useShortName) => setSignatureProp({ useShortName })}
              >
                Bruk forkortede navn
              </Checkbox>
            ) : null}

            {showMedunderskriverCheckbox ? (
              <Checkbox
                disabled={disabledCheckbox}
                checked={element.includeMedunderskriver}
                onChange={(includeMedunderskriver) => setSignatureProp({ includeMedunderskriver })}
              >
                Inkluder medunderskriver
              </Checkbox>
            ) : null}

            {showSuffixCheckbox ? (
              <Checkbox
                disabled={disabledCheckbox || signature?.anonymous === true}
                checked={element.useSuffix}
                onChange={(useSuffix) => setSignatureProp({ useSuffix })}
              >
                Bruk «/saksbehandler»-tittel
              </Checkbox>
            ) : null}

            {showUseMyNameCheckbox ? (
              <Checkbox
                disabled={
                  disabledCheckbox ||
                  (user.navIdent === creator && (overriddenWithSelf || element.overriddenSaksbehandler === undefined))
                }
                checked={
                  overriddenWithSelf || (user.navIdent === creator && element.overriddenSaksbehandler === undefined)
                }
                onChange={(checked) => setOverriddenSaksbehandler(checked ? user.navIdent : undefined)}
              >
                Signer med mitt navn
              </Checkbox>
            ) : null}
          </HStack>
        )}

        <HStack justify="space-between" wrap={false} marginBlock="4">
          <MedunderskriverSignature element={element} />
          <SaksbehandlerSignature element={element} />
        </HStack>

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

interface CheckboxProps {
  children: string;
  checked?: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ children, onChange, ...props }: CheckboxProps) => {
  const id = useId();

  return (
    <HStack align="center" style={{ fontSize: '1em' }}>
      <input
        {...props}
        id={id}
        className="h-[1.2em] w-[1.2em] cursor-pointer"
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} style={{ paddingLeft: pxToEm(8) }} className="cursor-pointer">
        {children}
      </label>
    </HStack>
  );
};
