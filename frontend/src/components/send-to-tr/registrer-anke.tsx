import { Box, Heading, InlineMessage } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { GrafanaDomainProvider } from '@/components/grafana-domain-context/grafana-domain-context';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { AnkeForm } from '@/components/send-to-tr/anke-form';
import { NONE_ENTRY, RELEVANT_YTELSER } from '@/components/send-to-tr/constants';
import { isFnr, removeWhitespace } from '@/components/send-to-tr/fnr';
import { RegistrationSuccess } from '@/components/send-to-tr/registration-success';
import { SearchForm, toEntry } from '@/components/send-to-tr/search-form';
import type { RegisteredAnke } from '@/components/send-to-tr/types';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';
import type { IYtelse } from '@/types/kodeverk';

export const RegistrerAnke = () => {
  const [fnrValue, setFnrValue] = useState('');
  const [selectedYtelse, setSelectedYtelse] = useState<IYtelse | null>(null);
  const [registeredAnke, setRegisteredAnke] = useState<RegisteredAnke | null>(null);

  const trimmedFnr = removeWhitespace(fnrValue);
  const validFnr = isFnr(trimmedFnr);
  const showFnrError = trimmedFnr.length >= 11 && !validFnr;

  const { data: ytelseOptions = [] } = useLatestYtelser();

  const options = useMemo((): Entry<IYtelse | null>[] => {
    return [NONE_ENTRY, ...ytelseOptions.filter((o) => RELEVANT_YTELSER.includes(o.id)).map(toEntry)];
  }, [ytelseOptions]);

  const setFnr = (fnr: string) => {
    setRegisteredAnke(null);
    setFnrValue(fnr);
  };

  const onRegistered = (registered: RegisteredAnke) => {
    setFnrValue('');
    setSelectedYtelse(null);
    setRegisteredAnke(registered);
  };

  return (
    <GrafanaDomainProvider domain="registrer-anke-i-trygderetten-fra-arena">
      <Box padding="space-16" overflowY="auto" margin="space-8">
        <title>Registrer anke i Trygderetten fra Arena</title>
        <Heading level="1" size="medium" spacing>
          Registrer anke i Trygderetten fra Arena
        </Heading>
        <SearchForm
          fnr={fnrValue}
          setFnr={setFnr}
          selectedYtelse={selectedYtelse}
          setSelectedYtelse={setSelectedYtelse}
          options={options}
          error={showFnrError}
        />
        {registeredAnke === null ? (
          <AnkeFormOrGuidance
            trimmedFnr={trimmedFnr}
            validFnr={validFnr}
            selectedYtelse={selectedYtelse}
            onRegistered={onRegistered}
          />
        ) : (
          <RegistrationSuccess registeredAnke={registeredAnke} />
        )}
      </Box>
    </GrafanaDomainProvider>
  );
};

interface AnkeFormOrGuidanceProps {
  trimmedFnr: string;
  validFnr: boolean;
  selectedYtelse: IYtelse | null;
  onRegistered: (registeredAnke: RegisteredAnke) => void;
}

const AnkeFormOrGuidance = ({ trimmedFnr, validFnr, selectedYtelse, onRegistered }: AnkeFormOrGuidanceProps) => {
  if (validFnr) {
    if (selectedYtelse === null) {
      return <Guidance>Du må velge ytelse.</Guidance>;
    }

    return (
      <AnkeForm
        key={`${trimmedFnr}-${selectedYtelse.id}`}
        fnr={trimmedFnr}
        selectedYtelse={selectedYtelse}
        onRegistered={onRegistered}
      />
    );
  }

  if (selectedYtelse === null) {
    return <Guidance>Du må både fylle inn fødselsnummer og velge ytelse.</Guidance>;
  }

  return <Guidance>Du må fylle inn fødselsnummer.</Guidance>;
};

const Guidance = ({ children }: { children: string }) => (
  <InlineMessage status="info" className="my-4">
    {children}
  </InlineMessage>
);
