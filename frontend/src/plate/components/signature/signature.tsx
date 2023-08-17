import { Checkbox } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { PlateEditor, PlateElement, PlateRenderElementProps, setNodes } from '@udecode/plate-common';
import React, { useEffect } from 'react';
import { useSelected } from 'slate-react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { IndividualSignature } from '@app/plate/components/signature/individual-signature';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import { EditorValue, ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

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
        <SectionToolbar contentEditable={false} $sectionType={SectionTypeEnum.SIGNATURE} $label="Signatur">
          <AddNewParagraphs editor={editor} element={element} />
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};

const StyledCheckbox = styled(Checkbox)`
  width: fit-content;
  border-width: 2px;
  border-style: dashed;
  border-color: inherit;
  border-radius: var(--a-border-radius-medium);
  padding-left: 8px;
  padding-right: 8px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 6pt;
  margin-top: 24pt;
  user-select: none;
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
