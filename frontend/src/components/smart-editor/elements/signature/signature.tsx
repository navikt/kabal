import { skipToken } from '@reduxjs/toolkit/dist/query';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Checkbox } from 'nav-frontend-skjema';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { ISignatureResponse, useGetSignatureQuery } from '../../../../redux-api/bruker';
import { ISignature, ISignatureContent } from '../../../../types/smart-editor';

interface Props {
  savedContent: ISignatureContent;
  onChange: (content: ISignatureContent) => void;
}

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver?.navIdent === 'string' ? oppgave.medunderskriver.navIdent : skipToken
  );

  if (typeof oppgave === 'undefined' || typeof medunderskriverSignature === 'undefined') {
    return undefined;
  }

  if (oppgave.medunderskriver === null) {
    return null;
  }

  return medunderskriverSignature;
};

export const Signature = React.memo(
  ({ savedContent, onChange }: Props) => {
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
        name: getName(saksbehandlerSignature, savedContent.useShortName),
        title: getTitle(saksbehandlerSignature.customJobTitle) ?? 'TITTEL MANGLER',
      };

      const medunderskriver: ISignature | undefined =
        medunderskriverSignature === null
          ? undefined
          : {
              name: getName(medunderskriverSignature, savedContent.useShortName),
              title: medunderskriverSignature.customJobTitle ?? 'TITTEL MANGLER',
            };

      if (
        savedContent.saksbehandler?.name === saksbehandler.name &&
        savedContent.saksbehandler?.title === saksbehandler.title &&
        savedContent.medunderskriver?.name === medunderskriver?.name &&
        savedContent.medunderskriver?.title === medunderskriver?.title
      ) {
        return;
      }

      onChange({
        useShortName: savedContent.useShortName,
        medunderskriver,
        saksbehandler,
      });
    }, [saksbehandlerSignature, onChange, savedContent, medunderskriverSignature]);

    if (typeof oppgave === 'undefined') {
      return null;
    }

    return (
      <SignaturesContainer>
        <StyledCheckbox
          label="Bruk forkortede navn"
          checked={savedContent.useShortName}
          onChange={({ target }) => onChange({ ...savedContent, useShortName: target.checked })}
        />
        <StyledSignatures>
          <IndividualSignature user={medunderskriverSignature} useShortName={savedContent.useShortName} />
          <IndividualSignature
            user={saksbehandlerSignature}
            useShortName={savedContent.useShortName}
            titleSuffix="saksbehandler"
          />
        </StyledSignatures>
      </SignaturesContainer>
    );
  },
  (prevProps, nextProps) =>
    prevProps.savedContent.useShortName === nextProps.savedContent.useShortName &&
    areSignaturesEqual(prevProps.savedContent.saksbehandler, nextProps.savedContent.saksbehandler) &&
    areSignaturesEqual(prevProps.savedContent.medunderskriver, nextProps.savedContent.medunderskriver)
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
  border: 2px dashed black;
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
`;

const StyledSignatures = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface IndividualSignatureProps {
  useShortName: boolean;
  titleSuffix?: string;
  user?: ISignatureResponse | null;
}

const IndividualSignature = ({ user, titleSuffix, useShortName }: IndividualSignatureProps) => {
  if (user === null || typeof user === 'undefined') {
    return null;
  }

  const { customJobTitle } = user;

  return (
    <div>
      <div>{getName(user, useShortName)}</div>
      <Title title={getTitle(customJobTitle, titleSuffix)} />
    </div>
  );
};

const getName = (user: ISignatureResponse, useShortName: boolean) =>
  useShortName ? getShortName(user) : getLongName(user);

const getShortName = ({ customShortName, generatedShortName }: ISignatureResponse): string =>
  customShortName ?? generatedShortName;

const getLongName = ({ customLongName, longName }: ISignatureResponse): string => customLongName ?? longName;

interface TitleProps {
  title: string | null;
}

const Title = ({ title }: TitleProps): JSX.Element => {
  if (title === null) {
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
