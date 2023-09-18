import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateEditor, PlateElement, PlateRenderElementProps, setNodes } from '@udecode/plate-common';
import React, { useEffect } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { IndividualSignature } from '@app/plate/components/signature/individual-signature';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import { EditorValue, ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.navIdent === 'string' ? oppgave?.medunderskriver.navIdent : skipToken,
  );

  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (typeof medunderskriverSignature === 'undefined') {
    return null;
  }

  if (oppgave.medunderskriver.navIdent === null) {
    return null;
  }

  return medunderskriverSignature;
};

const useSignatureData = (editor: PlateEditor<EditorValue>, element: SignatureElement) => {
  const medunderskriverSignature = useMedunderskriverSignature();
  const { data: oppgave } = useOppgave();
  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    typeof oppgave?.tildeltSaksbehandler?.navIdent === 'string' ? oppgave.tildeltSaksbehandler.navIdent : skipToken,
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
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <SectionContainer
        $isSelected={isSelected}
        $sectionType={SectionTypeEnum.SIGNATURE}
        onDragStart={(event) => event.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <StyledCheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={element.useShortName}
            onChange={({ target }) => {
              setNodes(
                editor,
                { ...element, useShortName: target.checked },
                { at: [], voids: true, mode: 'lowest', match: (n) => n === element },
              );
            }}
          />
          Bruk forkortede navn
        </StyledCheckboxContainer>

        <StyledSignatures>
          <IndividualSignature signature={element.medunderskriver} />
          <IndividualSignature signature={element.saksbehandler} />
        </StyledSignatures>
        {children}
        <SectionToolbar contentEditable={false} $sectionType={SectionTypeEnum.SIGNATURE} $label="Signatur">
          <AddNewParagraphs editor={editor} element={element} />
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

const StyledCheckboxContainer = styled.label`
  display: flex;
  width: min-content;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: ${ptToEm(6)};
  padding: ${ptToEm(6)};
  border-width: ${ptToEm(2)};
  border-style: dashed;
  border-color: inherit;
  border-radius: var(--a-border-radius-medium);
  padding-left: ${ptToEm(6)};
  padding-right: ${ptToEm(6)};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${ptToEm(6)};
  margin-top: ${ptToEm(24)};
  user-select: none;
  font-size: 1em;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.5em;
  height: 1.5em;
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
