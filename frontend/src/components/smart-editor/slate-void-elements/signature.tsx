import { skipToken } from '@reduxjs/toolkit/dist/query';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Checkbox } from 'nav-frontend-skjema';
import React, { useEffect } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { ISignatureResponse, useGetSignatureQuery } from '../../../redux-api/bruker';
import { ISignature, SignatureElementType } from '../editor-types';
import { voidStyle } from './style';

interface Props {
  element: SignatureElementType;
}

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

export const Signature = React.memo(
  ({ element }: Props) => {
    const editor = useSlateStatic();

    useSignatureData(element);

    return (
      <SignaturesContainer>
        <StyledCheckbox
          label="Bruk forkortede navn"
          checked={element.useShortName}
          onChange={({ target }) => {
            Transforms.setNodes<SignatureElementType>(
              editor,
              { ...element, useShortName: target.checked },
              { at: [], voids: true, mode: 'lowest', match: (n) => n === element }
            );
          }}
        />
        <StyledSignatures>
          <IndividualSignature signature={element.medunderskriver} />
          <IndividualSignature signature={element.saksbehandler} />
        </StyledSignatures>
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
  padding: 8px;
  margin-left: auto;
  margin-right: auto;
  user-select: none;
`;

const SignaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 32px;
  ${voidStyle}
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface IndividualSignatureProps {
  signature: ISignature | undefined;
}

const IndividualSignature = ({ signature }: IndividualSignatureProps) => {
  if (typeof signature === 'undefined') {
    return null;
  }

  return (
    <div>
      <div>{signature.name}</div>
      <Title title={signature.title} />
    </div>
  );
};

const MISSING_TITLE = 'TITTEL MANGLER';

const getName = (user: ISignatureResponse, useShortName: boolean) =>
  useShortName ? getShortName(user) : getLongName(user);

const getShortName = ({ customShortName, generatedShortName }: ISignatureResponse): string =>
  customShortName ?? generatedShortName;

const getLongName = ({ customLongName, longName }: ISignatureResponse): string => customLongName ?? longName;

interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps): JSX.Element => {
  if (title === MISSING_TITLE) {
    return <StyledWarning>Tittel mangler</StyledWarning>;
  }

  return <div>{title}</div>;
};

const getTitle = (title: string | null, suffix?: string): string | null => {
  if (title === null) {
    return null;
  }

  if (typeof suffix === 'undefined') {
    return title;
  }

  return `${title}/${suffix}`;
};

const StyledWarning = styled(AlertStripeAdvarsel)`
  margin-top: 4px;
`;
