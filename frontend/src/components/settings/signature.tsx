import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMySignatureQuery, useSetAnonymousMutation, useSetCustomInfoMutation } from '@app/redux-api/bruker';
import { type ISetCustomInfoParams, type ISignatureResponse, Role } from '@app/types/bruker';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Checkbox, HStack, Loader, Radio, RadioGroup, TextField } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
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
      <Anonymous saksbehandlerSignature={ownSignature} />
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
        label="Stillingstittel"
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

const Anonymous = ({ saksbehandlerSignature }: Pick<SignatureProps, 'saksbehandlerSignature'>) => {
  const [setAnonymous, updateStatus] = useSetAnonymousMutation();
  const hasAccess = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  if (!hasAccess) {
    return null;
  }

  return (
    <HStack align="end" gap="2" width="100%">
      <Checkbox checked={saksbehandlerSignature.anonymous} onChange={({ target }) => setAnonymous(target.checked)}>
        Signer anonymt med «Nav klageinstans»
      </Checkbox>
      <Status {...updateStatus} />
    </HStack>
  );
};

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
    <HStack align="end" gap="2" width="100%">
      <StyledInput
        label={label}
        value={value}
        onChange={({ target }) => setDefaultValue(target.value)}
        disabled={saksbehandlerSignature.anonymous}
      />
      <Status {...updateStatus} />
    </HStack>
  );
};

const TITLES = ['rådgiver', 'seniorrådgiver', 'fagleder', 'avdelingsdirektør', 'førstekonsulent'];

const TitleSelector = ({ infoKey, saksbehandlerSignature, label, navIdent }: SignatureProps) => {
  const savedValue = saksbehandlerSignature[infoKey];
  const [setInfo, updateStatus] = useSetCustomInfoMutation();
  const isRol = useHasRole(Role.KABAL_ROL);

  if (isRol) {
    return null;
  }

  return (
    <>
      <StyledRadioGroup legend={label} value={savedValue} disabled={saksbehandlerSignature.anonymous}>
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
      <HStack align="center" marginBlock="0 3">
        <Loader size="xsmall" /> <StyledStatusText>Lagrer ...</StyledStatusText>
      </HStack>
    );
  }

  if (isSuccess) {
    return (
      <HStack align="center" marginBlock="0 3">
        <StyledSuccess /> <StyledStatusText>Lagret!</StyledStatusText>
      </HStack>
    );
  }

  if (isError) {
    return (
      <HStack align="center" marginBlock="0 3">
        <StyledError /> <StyledStatusText>Ikke lagret</StyledStatusText>
      </HStack>
    );
  }

  return null;
};

const StyledInput = styled(TextField)`
  margin-top: var(--a-spacing-4);
  margin-right: 6px;
  width: 350px;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: var(--a-spacing-4);
`;

const StyledSuccess = styled(CheckmarkCircleIcon)`
  color: #006a23;
`;

const StyledError = styled(XMarkOctagonIcon)`
  color: #ba3a26;
`;

const StyledStatusText = styled.span`
  font-size: var(--a-spacing-3);
  margin-left: 3px;
`;
