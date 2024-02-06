import { PlateElement, PlateRenderElementProps, setNodes, useEditorReadOnly } from '@udecode/plate-common';
import React from 'react';
import { styled } from 'styled-components';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import { useSignatureData } from '@app/plate/components/signature/hooks';
import { IndividualSignature } from '@app/plate/components/signature/individual-signature';
import { EditorValue, SignatureElement } from '@app/plate/types';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '../styled-components';

export const Signature = ({
  element,
  attributes,
  children,
  editor,
}: PlateRenderElementProps<EditorValue, SignatureElement>) => {
  useSignatureData(editor, element);
  const isReadOnly = useEditorReadOnly();

  return (
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <SectionContainer
        data-element={element.type}
        $sectionType={SectionTypeEnum.SIGNATURE}
        onDragStart={(event) => event.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <StyledCheckboxContainer>
          <Checkbox
            disabled={isReadOnly}
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
        <SectionToolbar>
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
