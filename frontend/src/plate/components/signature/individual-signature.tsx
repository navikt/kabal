import { SmartEditorContext } from '@app/components/smart-editor/context';
import { getName } from '@app/plate/components/signature/functions';
import { useMainSignature, useMedunderskriverSignature } from '@app/plate/components/signature/hooks';
import { type SignatureElement, useMyPlateEditorRef } from '@app/plate/types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useContext, useEffect, useMemo } from 'react';
import { MISSING_TITLE, Title } from './title';

interface Props {
  element: SignatureElement;
}

export const SaksbehandlerSignature = ({ element }: Props) => {
  const editor = useMyPlateEditorRef();
  const signature = useMainSignature(element);
  const { hasWriteAccess } = useContext(SmartEditorContext);

  useEffect(() => {
    if (
      !hasWriteAccess ||
      signature === element.saksbehandler ||
      (signature?.name === element.saksbehandler?.name && signature?.title === element.saksbehandler?.title)
    ) {
      return;
    }

    editor.tf.setNodes({ saksbehandler: signature }, { at: [], match: (n) => n === element });
  }, [editor, element, signature, hasWriteAccess]);

  if (signature === undefined) {
    return null;
  }

  return (
    <div className="whitespace-nowrap">
      <div>{element.saksbehandler?.name}</div>
      {element.saksbehandler?.title === undefined ? null : <Title title={element.saksbehandler.title} />}
    </div>
  );
};

interface MedunderskriverSignatureProps {
  element: SignatureElement;
}

export const MedunderskriverSignature = ({ element }: MedunderskriverSignatureProps) => {
  const editor = useMyPlateEditorRef();
  const medunderskriverSignature = useMedunderskriverSignature();
  const { templateId, hasWriteAccess } = useContext(SmartEditorContext);

  const noMedunderskriver = useMemo(
    () => medunderskriverSignature === null || templateId === TemplateIdEnum.ROL_ANSWERS,
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
    if (!hasWriteAccess) {
      return;
    }

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
  }, [editor, element, noMedunderskriver, signature, hasWriteAccess]);

  if (noMedunderskriver || signature === undefined) {
    return null;
  }

  return (
    <div className="whitespace-nowrap">
      <div>{element.medunderskriver?.name}</div>
      {element.medunderskriver?.title === undefined ? null : <Title title={element.medunderskriver.title} />}
    </div>
  );
};
