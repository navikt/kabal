import { Checkbox } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateEditor, PlateRenderElementProps, setNodes } from '@udecode/plate-common';
import React, { useEffect } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { IndividualSignature } from '@app/plate/components/signature/individual-signature';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import { EditorValue, ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriverident === 'string' ? oppgave.medunderskriverident : skipToken,
  );

  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (typeof medunderskriverSignature === 'undefined') {
    return null;
  }

  if (oppgave.medunderskriverident === null) {
    return null;
  }

  return medunderskriverSignature;
};

const useSignatureData = (editor: PlateEditor<EditorValue>, element: SignatureElement) => {
  const medunderskriverSignature = useMedunderskriverSignature();
  const { data: oppgave } = useOppgave();
  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    typeof oppgave?.tildeltSaksbehandlerident === 'string' ? oppgave.tildeltSaksbehandlerident : skipToken,
  );

  useEffect(() => {
    if (typeof saksbehandlerSignature === 'undefined' || typeof medunderskriverSignature === 'undefined') {
      return;
    }

    const saksbehandler: ISignature = {
      name: getName(saksbehandlerSignature, element.useShortName),
      title: getTitle(saksbehandlerSignature.customJobTitle, 'saksbehandler') ?? MISSING_TITLE,
    };

    const medunderskriver: ISignature | undefined =
      medunderskriverSignature === null
        ? undefined
        : {
            name: getName(medunderskriverSignature, element.useShortName),
            title: medunderskriverSignature.customJobTitle ?? MISSING_TITLE,
          };

    if (
      element.saksbehandler?.name === saksbehandler.name &&
      element.saksbehandler?.title === saksbehandler.title &&
      element.medunderskriver?.name === medunderskriver?.name &&
      element.medunderskriver?.title === medunderskriver?.title
    ) {
      return;
    }

    const data: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      medunderskriver,
      saksbehandler,
    };

    setNodes(editor, data, { at: [], voids: true, mode: 'lowest', match: (n) => n === element });
  }, [editor, element, medunderskriverSignature, saksbehandlerSignature]);
};

export const Signature = ({
  element,
  attributes,
  children,
  editor,
}: PlateRenderElementProps<EditorValue, SignatureElement>) => {
  const isSelected = useSelected();

  useSignatureData(editor, element);

  return (
    <SignaturesContainer
      {...attributes}
      contentEditable={false}
      $isFocused={isSelected}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <StyledCheckbox
        checked={element.useShortName}
        size="small"
        onChange={({ target }) => {
          setNodes(
            editor,
            { ...element, useShortName: target.checked },
            { at: [], voids: true, mode: 'lowest', match: (n) => n === element },
          );
        }}
      >
        Bruk forkortede navn
      </StyledCheckbox>
      <StyledSignatures>
        <IndividualSignature signature={element.medunderskriver} />
        <IndividualSignature signature={element.saksbehandler} />
      </StyledSignatures>
      {children}
    </SignaturesContainer>
  );
};

const StyledCheckbox = styled(Checkbox)`
  width: fit-content;
  border-width: 2px;
  border-style: dashed;
  border-color: inherit;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8px;
  user-select: none;
`;

const SignaturesContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 32px;
  border-radius: 2px;
  transition:
    background-color 0.2s ease-in-out,
    outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
