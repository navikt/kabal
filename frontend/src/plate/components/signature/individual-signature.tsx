import { SmartEditorContext } from '@app/components/smart-editor/context';
import { getName } from '@app/plate/components/signature/functions';
import { useMainSignature, useMedunderskriverSignature } from '@app/plate/components/signature/hooks';
import { type SignatureElement, useMyPlateEditorRef } from '@app/plate/types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useContext, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { MISSING_TITLE, Title } from './title';

interface Props {
  element: SignatureElement;
}

export const SaksbehandlerSignature = ({ element }: Props) => {
  const editor = useMyPlateEditorRef();
  const signature = useMainSignature(element);

  useEffect(() => {
    if (
      signature === element.saksbehandler ||
      (signature?.name === element.saksbehandler?.name && signature?.title === element.saksbehandler?.title)
    ) {
      return;
    }

    editor.tf.setNodes({ saksbehandler: signature }, { at: [], match: (n) => n === element });
  }, [editor, element, signature]);

  if (signature === undefined) {
    return null;
  }

  return (
    <Container>
      <SignatureContainer>
        <div>{signature.name}</div>
        {signature.title === undefined ? null : <Title title={signature.title} />}
      </SignatureContainer>
    </Container>
  );
};

interface MedunderskriverSignatureProps {
  element: SignatureElement;
}

export const MedunderskriverSignature = ({ element }: MedunderskriverSignatureProps) => {
  const editor = useMyPlateEditorRef();
  const medunderskriverSignature = useMedunderskriverSignature();
  const { templateId } = useContext(SmartEditorContext);

  const noMedunderskriver = useMemo(
    () =>
      medunderskriverSignature === null ||
      templateId === TemplateIdEnum.ROL_QUESTIONS ||
      templateId === TemplateIdEnum.ROL_ANSWERS,
    [medunderskriverSignature, templateId],
  );

  const signature = useMemo(
    () =>
      noMedunderskriver || medunderskriverSignature === null || !element.includeMedunderskriver
        ? undefined
        : {
            name: getName(medunderskriverSignature, element.useShortName),
            title: medunderskriverSignature.customJobTitle ?? MISSING_TITLE,
          },
    [noMedunderskriver, medunderskriverSignature, element.includeMedunderskriver, element.useShortName],
  );

  useEffect(() => {
    if (noMedunderskriver) {
      if (element.medunderskriver === undefined) {
        return;
      }

      const data: Partial<SignatureElement> = {
        useShortName: element.useShortName,
        saksbehandler: element.saksbehandler,
        medunderskriver: undefined,
      };

      return editor.tf.setNodes(data, { match: (n) => n === element, at: [] });
    }

    if (element.medunderskriver?.name === signature?.name && element.medunderskriver?.title === signature?.title) {
      return;
    }

    const data: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      saksbehandler: element.saksbehandler,
      medunderskriver: signature,
    };

    editor.tf.setNodes(data, { match: (n) => n === element, at: [] });
  }, [editor, element, noMedunderskriver, signature]);

  if (noMedunderskriver || signature === undefined) {
    return null;
  }

  return (
    <Container>
      <SignatureContainer>
        <div>{signature.name}</div>
        <Title title={signature.title} />
      </SignatureContainer>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'toggle'
    'signature';
  width: min-content;
  align-items: start;
`;

const SignatureContainer = styled.div`
  grid-area: signature;
  white-space: nowrap;
`;
