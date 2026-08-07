import { Box, Button, Heading, HStack, Link, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GrafanaDomainProvider } from '@/components/grafana-domain-context/grafana-domain-context';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { initialFields, NONE_ENTRY, RELEVANTE_YTELSER } from '@/components/send-til-tr-temp/constants';
import { GosysOppgaveFields } from '@/components/send-til-tr-temp/gosys-oppgave-fields';
import { GosysOppgaver } from '@/components/send-til-tr-temp/gosys-oppgaver';
import { SearchForm } from '@/components/send-til-tr-temp/search-form';
import { useGosysOppgaverQuery, useSendToTrygderettenMutation } from '@/redux-api/gosys-oppgaver';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue, IYtelseInnsendingshjemmel } from '@/types/kodeverk';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export interface GosysOppgaveState {
  sakenGjelder: string;
  ytelseId: string;
  fagsakId: string;
  sakMottattKlageinstans: string | null;
  sendtTilTrygderetten: string | null;
  hjemmelIdList: string[];
  gosysOppgaveId: number;
}

export const RegistrerAnke = () => {
  const [fnr, setFnr] = useState('');
  const [selectedYtelse, setSelectedYtelse] = useState('');
  const [closeAlert, setCloseAlert] = useState(false);
  const [hjemler, setHjemler] = useState<IYtelseInnsendingshjemmel[]>([]);
  const [selectedGosysOppgave, setSelectedGosysOppgave] = useState<ListGosysOppgave | undefined>(undefined);
  const { data: ytelseOptions } = useLatestYtelser();
  const removeWhitespace = (str: string) => str.replaceAll(/\s+/gi, '');
  const cleanFnr = removeWhitespace(fnr);
  const { currentData: gosysOppgaver, isLoading: isLoadingGosysOppgaver } = useGosysOppgaverQuery(
    cleanFnr.length === 11 && selectedYtelse ? { fnr: cleanFnr, ytelseId: selectedYtelse } : skipToken,
  );
  const [register, { data, isLoading: isRegistering, isSuccess }] = useSendToTrygderettenMutation();
  const [oppgaveFields, setOppgaveFields] = useState<GosysOppgaveState>(initialFields);
  const sakLink = data ? `/behandling/${data}` : undefined;

  const options = useMemo(
    (): Entry<IKodeverkSimpleValue | null>[] => [
      NONE_ENTRY,
      ...(ytelseOptions ?? [])
        .filter((o) => RELEVANTE_YTELSER.includes(o.navn))
        .map((o) => ({
          value: o,
          key: o.id,
          plainText: o.navn,
          label: o.navn,
        })),
    ],
    [ytelseOptions],
  );

  const selectedEntry = useMemo(
    (): Entry<IKodeverkSimpleValue | null> | null =>
      options.find((entry) => entry.key === selectedYtelse) ?? NONE_ENTRY,
    [options, selectedYtelse],
  );

  const registerAnke = async () => {
    await register({
      ...oppgaveFields,
      sakenGjelder: cleanFnr,
      ytelseId: selectedYtelse,
      gosysOppgaveId: oppgaveFields.gosysOppgaveId,
      sakMottattKlageinstans: oppgaveFields.sakMottattKlageinstans ?? '',
      sendtTilTrygderetten: oppgaveFields.sendtTilTrygderetten ?? '',
    });
  };

  const fieldsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedGosysOppgave) {
      fieldsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedGosysOppgave]);

  useEffect(() => {
    if (isSuccess) {
      setOppgaveFields({
        sakenGjelder: '',
        ytelseId: '',
        fagsakId: '',
        sakMottattKlageinstans: null,
        sendtTilTrygderetten: null,
        hjemmelIdList: [] as string[],
        gosysOppgaveId: 0,
      });
      setSelectedGosysOppgave(undefined);
      setCloseAlert(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (gosysOppgaver) setSelectedGosysOppgave(undefined);
  }, [gosysOppgaver]);

  return (
    <GrafanaDomainProvider domain="registrer-anke-i-trygderetten">
      <Box padding="space-16" overflowY="auto" margin="space-8">
        <Heading level="1" size="medium" spacing>
          Registrer anke i Trygderetten fra Arena
        </Heading>
        <SearchForm
          fnr={fnr}
          setFnr={setFnr}
          selectedEntry={selectedEntry}
          setSelectedYtelse={setSelectedYtelse}
          options={options}
          setHjemler={setHjemler}
          ytelser={ytelseOptions}
        />
        {isLoadingGosysOppgaver ? (
          <HStack justify="center" padding="space-16">
            <Loader size="large" title="Laster oppgaver..." />
          </HStack>
        ) : (
          <>
            {gosysOppgaver?.length === 0 && (
              <LocalAlert status="warning">
                <LocalAlert.Header>
                  <LocalAlert.Title>Ingen oppgaver funnet</LocalAlert.Title>
                </LocalAlert.Header>
              </LocalAlert>
            )}
            {gosysOppgaver && gosysOppgaver?.length > 0 && (
              <VStack gap="space-16">
                <GosysOppgaver
                  gosysOppgaver={gosysOppgaver}
                  selectedGosysOppgave={selectedGosysOppgave}
                  onSelect={(oppgave) => {
                    setOppgaveFields({
                      ...initialFields,
                      gosysOppgaveId: oppgave.id,
                      ytelseId: selectedYtelse,
                    });
                    setSelectedGosysOppgave(oppgave);
                  }}
                />
                {selectedGosysOppgave && (
                  <VStack ref={fieldsRef} gap="space-16">
                    <GosysOppgaveFields
                      hjemler={hjemler}
                      setOppgaveFields={setOppgaveFields}
                      oppgaveFields={oppgaveFields}
                    />
                    <Button style={{ width: '7rem' }} onClick={registerAnke} loading={isRegistering}>
                      Registrer
                    </Button>
                  </VStack>
                )}
              </VStack>
            )}
          </>
        )}
        {isSuccess && !closeAlert && (
          <VStack marginBlock="space-32">
            <LocalAlert status="success">
              <LocalAlert.Header>
                <LocalAlert.Title>Saken ble registrert.</LocalAlert.Title>
                <LocalAlert.CloseButton onClick={() => setCloseAlert(true)} />
              </LocalAlert.Header>
              <LocalAlert.Content>
                <Link href={sakLink} target="_blank">
                  Se sak
                </Link>
              </LocalAlert.Content>
            </LocalAlert>
          </VStack>
        )}
      </Box>
    </GrafanaDomainProvider>
  );
};
