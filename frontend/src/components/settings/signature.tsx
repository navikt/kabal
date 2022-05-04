import { Error, Success } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { Input, Radio, RadioGruppe } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ISetCustomInfoParams,
  ISignatureResponse,
  useGetBrukerQuery,
  useGetMySignatureQuery,
  useSetCustomInfoMutation,
} from '../../redux-api/bruker';
import { SectionHeader, SettingsSection } from './styled-components';

export const Signature = () => {
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const { data: saksbehandlerSignature, isLoading: signatureIsLoading } = useGetMySignatureQuery();

  if (
    signatureIsLoading ||
    brukerIsLoading ||
    typeof saksbehandlerSignature === 'undefined' ||
    typeof bruker === 'undefined'
  ) {
    return null;
  }

  return (
    <SettingsSection>
      <SectionHeader>Signatur</SectionHeader>
      <p>
        <strong>NB: Endringer gjort her påvirker kun KABAL.</strong>
      </p>
      <p>Her kan du endre navn og stillingstittel til det du selv ønsker.</p>
      <p>Navn og tittel du skriver inn her er det andre vil se om deg og det som blir brukt som signatur.</p>
      <p>
        Om du har navn du ikke ønsker å bruke, eller endringer som ikke er oppdatert ennå, er dette stedet å overstyre
        det.
      </p>
      <SignatureValue
        navIdent={bruker.navIdent}
        saksbehandlerSignature={saksbehandlerSignature}
        infoKey="customLongName"
        label="Langt navn (f.eks.: Kari Nordmann)"
      />
      <SignatureValue
        navIdent={bruker.navIdent}
        saksbehandlerSignature={saksbehandlerSignature}
        infoKey="customShortName"
        label="Kort navn (f.eks. K. Nordmann)"
      />
      <TitleSelector
        navIdent={bruker.navIdent}
        saksbehandlerSignature={saksbehandlerSignature}
        infoKey="customJobTitle"
        label="Stillingstittel (f.eks. Rådgiver)"
      />
    </SettingsSection>
  );
};

interface SignatureProps {
  navIdent: string;
  label: string;
  saksbehandlerSignature: ISignatureResponse;
  infoKey: ISetCustomInfoParams['key'];
}

const SignatureValue = ({ infoKey, saksbehandlerSignature, label, navIdent }: SignatureProps) => {
  const savedValue = saksbehandlerSignature[infoKey];
  const [setInfo, updateStatus] = useSetCustomInfoMutation();
  const [value, setDefaultValue] = useState<string>(savedValue ?? '');

  useEffect(() => {
    if (value === (savedValue ?? '')) {
      return;
    }

    const timeout = setTimeout(() => setInfo({ key: infoKey, value, navIdent }), 1000);
    return () => clearTimeout(timeout);
  }, [value, savedValue, navIdent, infoKey, setInfo]);

  return (
    <StyledSignature>
      <StyledInput
        label={label}
        value={value}
        bredde="fullbredde"
        onChange={({ target }) => setDefaultValue(target.value)}
      />
      <Status {...updateStatus} />
    </StyledSignature>
  );
};

const TITLES = ['Rådgiver', 'Seniorrådgiver', 'Fagleder', 'Avdelingsdirektør'];

const TitleSelector = ({ infoKey, saksbehandlerSignature, label, navIdent }: SignatureProps) => {
  const savedValue = saksbehandlerSignature[infoKey];
  const [setInfo, updateStatus] = useSetCustomInfoMutation();

  return (
    <>
      <StyledRadioGroup legend={label}>
        {TITLES.map((value) => (
          <Radio
            name={infoKey}
            onChange={() => setInfo({ key: infoKey, value, navIdent })}
            label={value}
            value={value}
            checked={value === savedValue}
            key={value}
          />
        ))}
      </StyledRadioGroup>
      <Status {...updateStatus} />
    </>
  );
};

interface StatusProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const Status = ({ isError, isLoading, isSuccess }: StatusProps) => {
  if (isLoading) {
    return (
      <StyledStatus>
        <Loader size="xsmall" /> <StyledStatusText>Lagrer ...</StyledStatusText>
      </StyledStatus>
    );
  }

  if (isSuccess) {
    return (
      <StyledStatus>
        <StyledSuccess /> <StyledStatusText>Lagret!</StyledStatusText>
      </StyledStatus>
    );
  }

  if (isError) {
    return (
      <StyledStatus>
        <StyledError /> <StyledStatusText>Ikke lagret</StyledStatusText>
      </StyledStatus>
    );
  }

  return null;
};

const StyledInput = styled(Input)`
  margin-top: 16px;
  margin-right: 6px;
  width: 350px;
`;

const StyledRadioGroup = styled(RadioGruppe)`
  margin-top: 16px;
`;

const StyledSignature = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
`;

const StyledSuccess = styled(Success)`
  color: #006a23;
`;

const StyledError = styled(Error)`
  color: #ba3a26;
`;

const StyledStatus = styled.span`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const StyledStatusText = styled.span`
  font-size: 12px;
  margin-left: 3px;
`;
