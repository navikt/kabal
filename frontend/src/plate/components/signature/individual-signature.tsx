import { setNodes } from '@udecode/plate-common';
import React, { useContext, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { useMedunderskriverSignature, useSaksbehandlerSignature } from '@app/plate/components/signature/hooks';
import { ISignature, SignatureElement, useMyPlateEditorRef } from '@app/plate/types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { MISSING_TITLE, Title } from './title';

interface Props {
  element: SignatureElement;
  useSuffix: boolean;
}

export const SaksbehandlerSignature = ({ element, useSuffix }: Props) => {
  const editor = useMyPlateEditorRef();
  const data = useSaksbehandlerSignature();
  const { templateId } = useContext(SmartEditorContext);

  const signature: ISignature | undefined = useMemo(() => {
    if (data === null) {
      return undefined;
    }

    const suffix = templateId !== TemplateIdEnum.ROL_ANSWERS && useSuffix ? 'saksbehandler' : undefined;

    if (data.anonymous) {
      return { name: 'NAV Klageinstans' };
    }

    return {
      name: getName(data, element.useShortName),
      title: getTitle(data.customJobTitle, suffix) ?? MISSING_TITLE,
    };
  }, [data, element.useShortName, templateId, useSuffix]);

  useEffect(() => {
    if (element.saksbehandler?.name === signature?.name && element.saksbehandler?.title === signature?.title) {
      return;
    }

    const newData: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      saksbehandler: signature,
    };

    setNodes(editor, newData, { at: [], voids: true, mode: 'lowest', match: (n) => n === element });
  }, [editor, element, data, templateId, signature]);

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
  includeMedunderskriver: boolean;
}

export const MedunderskriverSignature = ({ element, includeMedunderskriver }: MedunderskriverSignatureProps) => {
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
      noMedunderskriver || medunderskriverSignature === null || !includeMedunderskriver
        ? undefined
        : {
            name: getName(medunderskriverSignature, element.useShortName),
            title: medunderskriverSignature.customJobTitle ?? MISSING_TITLE,
          },
    [noMedunderskriver, medunderskriverSignature, includeMedunderskriver, element.useShortName],
  );

  useEffect(() => {
    if (noMedunderskriver) {
      return setNodes(editor, { ...element, medunderskriver: undefined }, { match: (n) => n === element });
    }

    return setNodes(editor, { ...element, medunderskriver: signature }, { match: (n) => n === element });
  }, [noMedunderskriver, element, editor, signature]);

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
