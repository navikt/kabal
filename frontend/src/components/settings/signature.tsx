import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Loader, Radio, RadioGroup, TextField } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMySignatureQuery, useSetCustomInfoMutation } from '@app/redux-api/bruker';
import { ISetCustomInfoParams, ISignatureResponse, Role } from '@app/types/bruker';
import { SectionHeader, SettingsSection } from './styled-components';

export const Signature = () => {
  const { user } = useContext(StaticDataContext);
  const { data: ownSignature, isLoading: signatureIsLoading } = useGetMySignatureQuery();

  if (signatureIsLoading || typeof ownSignature === 'undefined') {
    return null;
  }

  return (
    <SettingsSection>
      <SectionHeader>Signatur</SectionHeader>
      <p>
        <strong>NB: Endringer gjort her påvirker kun Kabal.</strong>
      </p>
      <p>Her kan du endre navn og stillingstittel til det du selv ønsker.</p>
      <p>Navn og tittel du skriver inn her er det andre vil se om deg og det som blir brukt som signatur.</p>
      <p>
        Om du har navn du ikke ønsker å bruke, eller endringer som ikke er oppdatert ennå, er dette stedet å overstyre
        det.
      </p>
      <SignatureValue
        navIdent={user.navIdent}
        saksbehandlerSignature={ownSignature}
        infoKey="customLongName"
        label="Langt navn (f.eks.: Kari Nordmann)"
      />
      <SignatureValue
        navIdent={user.navIdent}
        saksbehandlerSignature={ownSignature}
        infoKey="customShortName"
        label="Kort navn (f.eks. K. Nordmann)"
      />
      <TitleSelector
        navIdent={user.navIdent}
        saksbehandlerSignature={ownSignature}
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
      <StyledInput label={label} value={value} onChange={({ target }) => setDefaultValue(target.value)} />
      <Status {...updateStatus} />
    </StyledSignature>
  );
};

const TITLES = ['Rådgiver', 'Seniorrådgiver', 'Fagleder', 'Avdelingsdirektør'];

const TitleSelector = ({ infoKey, saksbehandlerSignature, label, navIdent }: SignatureProps) => {
  const savedValue = saksbehandlerSignature[infoKey];
  const [setInfo, updateStatus] = useSetCustomInfoMutation();
  const isRol = useHasRole(Role.KABAL_ROL);

  if (isRol) {
    return null;
  }

  return (
    <>
      <StyledRadioGroup legend={label} value={savedValue}>
        {TITLES.map((value) => (
          <Radio name={infoKey} onChange={() => setInfo({ key: infoKey, value, navIdent })} value={value} key={value}>
            {value}
          </Radio>
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

const StyledInput = styled(TextField)`
  margin-top: 16px;
  margin-right: 6px;
  width: 350px;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: 16px;
`;

const StyledSignature = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
`;

const StyledSuccess = styled(CheckmarkCircleIcon)`
  color: #006a23;
`;

const StyledError = styled(XMarkOctagonIcon)`
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
