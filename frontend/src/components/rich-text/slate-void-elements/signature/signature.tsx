import { Checkbox } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo, useEffect } from 'react';
import { Transforms } from 'slate';
import { useSelected, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { RenderElementProps } from '../../slate-elements/render-props';
import { ISignature, SignatureElementType } from '../../types/editor-void-types';
import { voidStyle } from '../style';
import { getName, getTitle } from './functions';
import { IndividualSignature } from './individual-signature';
import { MISSING_TITLE } from './title';

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver?.navIdent === 'string' ? oppgave.medunderskriver.navIdent : skipToken
  );

  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (typeof medunderskriverSignature === 'undefined') {
    return null;
  }

  if (oppgave.medunderskriver === null) {
    return null;
  }

  return medunderskriverSignature;
};

const useSignatureData = (element: SignatureElementType) => {
  const editor = useSlateStatic();
  const medunderskriverSignature = useMedunderskriverSignature();
  const { data: oppgave } = useOppgave();
  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    typeof oppgave?.tildeltSaksbehandler?.navIdent === 'string' ? oppgave.tildeltSaksbehandler.navIdent : skipToken
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

    const data: Partial<SignatureElementType> = {
      useShortName: element.useShortName,
      medunderskriver,
      saksbehandler,
    };

    Transforms.setNodes<SignatureElementType>(editor, data, {
      at: [],
      voids: true,
      mode: 'lowest',
      match: (n) => n === element,
    });
  }, [editor, element, medunderskriverSignature, saksbehandlerSignature]);
};

export const Signature = memo(
  ({ element, attributes, children }: RenderElementProps<SignatureElementType>) => {
    const editor = useSlateStatic();
    const isSelected = useSelected();

    useSignatureData(element);

    return (
      <SignaturesContainer {...attributes} contentEditable={false} $isFocused={isSelected}>
        <StyledCheckbox
          checked={element.useShortName}
          onChange={({ target }) => {
            Transforms.setNodes<SignatureElementType>(
              editor,
              { ...element, useShortName: target.checked },
              { at: [], voids: true, mode: 'lowest', match: (n) => n === element }
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
  },
  (prevProps, nextProps) =>
    prevProps.element.useShortName === nextProps.element.useShortName &&
    areSignaturesEqual(prevProps.element.saksbehandler, nextProps.element.saksbehandler) &&
    areSignaturesEqual(prevProps.element.medunderskriver, nextProps.element.medunderskriver)
);

const areSignaturesEqual = (s1?: ISignature, s2?: ISignature): boolean => {
  if (typeof s1 === 'undefined' && typeof s2 === 'undefined') {
    return true;
  }

  return s1?.name === s2?.name && s1?.title === s2?.title;
};

Signature.displayName = 'Signature';

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
  ${voidStyle}
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;
  background-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
  outline-color: ${({ $isFocused }) => ($isFocused ? '#f5f5f5' : 'transparent')};
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;
