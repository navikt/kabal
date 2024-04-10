import { setNodes } from '@udecode/plate-common';
import React, { useContext, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { useMainSignature, useMedunderskriverSignature } from '@app/plate/components/signature/hooks';
import { ISignature, SignatureElement, useMyPlateEditorRef } from '@app/plate/types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { MISSING_TITLE, Title } from './title';

interface Props {
  element: SignatureElement;
}

export const SaksbehandlerSignature = ({ element }: Props) => {
  const editor = useMyPlateEditorRef();
  const { templateId } = useContext(SmartEditorContext);
  const saksbehandlerSignature = useMainSignature(templateId);

  const signature: ISignature | undefined = useMemo(() => {
    if (saksbehandlerSignature === null) {
      return undefined;
    }

    const suffix = templateId !== TemplateIdEnum.ROL_ANSWERS && element.useSuffix ? 'saksbehandler' : undefined;

    if (saksbehandlerSignature.anonymous) {
      return { name: 'NAV Klageinstans' };
    }

    return {
      name: getName(saksbehandlerSignature, element.useShortName),
      title: getTitle(saksbehandlerSignature.customJobTitle, suffix) ?? MISSING_TITLE,
    };
  }, [saksbehandlerSignature, templateId, element.useSuffix, element.useShortName]);

  useEffect(() => {
    if (element.saksbehandler?.name === signature?.name && element.saksbehandler?.title === signature?.title) {
      return;
    }

    const data: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      medunderskriver: element.medunderskriver,
      saksbehandler: signature,
    };

    setNodes(editor, data, {
      at: [],
      match: (n) => n === element,
    });
  }, [editor, element, saksbehandlerSignature, templateId, signature]);

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
      const data: Partial<SignatureElement> = {
        useShortName: element.useShortName,
        saksbehandler: element.saksbehandler,
        medunderskriver: undefined,
      };

      return setNodes(editor, data, { match: (n) => n === element, at: [] });
    }

    const data: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      saksbehandler: element.saksbehandler,
      medunderskriver: signature,
    };

    setNodes(editor, data, { match: (n) => n === element, at: [] });
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
