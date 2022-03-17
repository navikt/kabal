import { skipToken } from '@reduxjs/toolkit/dist/query';
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

export const Signature = React.memo(
  ({ savedContent, onChange }: Props) => {
    const { data: oppgave } = useOppgave();
    const { data: medunderskriverSignature } = useGetSignatureQuery(
      typeof oppgave?.medunderskriver?.navIdent === 'string' ? oppgave.medunderskriver.navIdent : skipToken
    );

    const { data: saksbehandlerSignature } = useGetSignatureQuery(
      typeof oppgave?.tildeltSaksbehandler?.navIdent === 'string' ? oppgave.tildeltSaksbehandler.navIdent : skipToken
    );

    const key: keyof ISignatureResponse = savedContent.useShortName ? 'customShortName' : 'customLongName';

    useEffect(() => {
      if (typeof saksbehandlerSignature === 'undefined' || typeof oppgave === 'undefined') {
        return;
      }

      const saksbehandler: ISignature = {
        name: saksbehandlerSignature[key] ?? '',
        title: getTitle(saksbehandlerSignature.customJobTitle),
      };

      if (oppgave.medunderskriver === null) {
        if (
          savedContent.saksbehandler?.name === saksbehandler.name &&
          savedContent.saksbehandler?.title === saksbehandler.title
        ) {
          return;
        }

        onChange({
          ...savedContent,
          saksbehandler,
        });

        return;
      }

      if (typeof medunderskriverSignature === 'undefined') {
        return;
      }

      const medunderskriver: ISignature = {
        name: medunderskriverSignature[key] ?? '',
        title: medunderskriverSignature.customJobTitle ?? '',
      };

      if (
        savedContent.saksbehandler?.name === saksbehandler.name &&
        savedContent.saksbehandler?.title === saksbehandler.title &&
        savedContent.medunderskriver?.name === medunderskriver.name &&
        savedContent.medunderskriver?.title === medunderskriver.title
      ) {
        return;
      }

      onChange({
        ...savedContent,
        medunderskriver,
        saksbehandler,
      });
    }, [saksbehandlerSignature, oppgave, key, onChange, savedContent, medunderskriverSignature]);

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
  user?: ISignatureResponse;
}

const IndividualSignature = ({ user, titleSuffix, useShortName }: IndividualSignatureProps) => {
  if (typeof user === 'undefined') {
    return null;
  }

  const { customJobTitle, customLongName, customShortName, generatedShortName, longName } = user;

  const name = useShortName ? customShortName ?? generatedShortName : customLongName ?? longName;

  return (
    <div>
      <div>{name}</div>
      <div>{getTitle(customJobTitle, titleSuffix)}</div>
    </div>
  );
};

const getTitle = (title: string | null, suffix?: string): string => {
  if (title === null) {
    return 'Tittel mangler.';
  }

  if (typeof suffix === 'undefined') {
    return title;
  }

  return `${title}/${suffix}`;
};
