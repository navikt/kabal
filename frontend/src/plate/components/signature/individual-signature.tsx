import { InlineMessage, Skeleton, VStack } from '@navikt/ds-react';
import { useEditorReadOnly } from 'platejs/react';
import { useEffect, useMemo } from 'react';
import { getName } from '@/plate/components/signature/functions';
import { useMainSignature, useMedunderskriverSignature } from '@/plate/components/signature/hooks';
import { MISSING_TITLE, Title } from '@/plate/components/signature/title';
import { type SignatureElement, useMyPlateEditorRef } from '@/plate/types';

interface Props {
  element: SignatureElement;
}

export const SaksbehandlerSignature = ({ element }: Props) => {
  const editor = useMyPlateEditorRef();
  const signature = useMainSignature(element);
  const readOnly = useEditorReadOnly();

  useEffect(() => {
    if (
      readOnly ||
      signature === element.saksbehandler ||
      (signature?.name === element.saksbehandler?.name && signature?.title === element.saksbehandler?.title)
    ) {
      return;
    }

    editor.tf.setNodes({ saksbehandler: signature }, { at: [], match: (n) => n === element });
  }, [editor, element, signature, readOnly]);

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
  const { signature: medunderskriverSignature, error, isLoading } = useMedunderskriverSignature();
  const readOnly = useEditorReadOnly();

  const signature = useMemo(
    () =>
      medunderskriverSignature === null || !element.includeMedunderskriver
        ? undefined
        : {
            name: getName(medunderskriverSignature, element.useShortName),
            title: medunderskriverSignature.customJobTitle ?? MISSING_TITLE,
          },
    [medunderskriverSignature, element.includeMedunderskriver, element.useShortName],
  );

  useEffect(() => {
    if (readOnly || isLoading) {
      return;
    }

    if (medunderskriverSignature === null) {
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
  }, [editor, element, signature, readOnly, medunderskriverSignature, isLoading]);

  if (isLoading) {
    return (
      <VStack>
        <Skeleton variant="text" width="170px" />
        <Skeleton variant="text" width="200px" />
      </VStack>
    );
  }

  if (error !== null) {
    return (
      <InlineMessage status="warning" className="max-w-[50%]">
        {error}
      </InlineMessage>
    );
  }

  if (signature === undefined) {
    return null;
  }

  return (
    <div className="whitespace-nowrap">
      <div>{element.medunderskriver?.name}</div>
      {element.medunderskriver?.title === undefined ? null : <Title title={element.medunderskriver.title} />}
    </div>
  );
};
