import { useInsertHjemlerInSettingsMutation } from '@app/redux-api/internal';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Checkbox, CheckboxGroup, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { useState } from 'react';

export const InsertHjemlerInSettings = () => {
  const { data = [] } = useLatestYtelser();
  const [selectedYtelse, setSelectedYtelse] = useState<string>();
  const [selectedHjemler, setSelectedHjemler] = useState<string[]>([]);

  const options = data.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  return (
    <VStack as="section" gap="4">
      <Heading size="small">Sett inn innsendingshjemler i innstillinger</Heading>

      <Select
        size="small"
        label="Ytelse"
        value={selectedYtelse}
        onChange={({ target }) => setSelectedYtelse(target.value)}
        className="w-160"
      >
        {options}
      </Select>

      {selectedYtelse === undefined ? null : (
        <Hjemler ytelse={selectedYtelse} selectedHjemler={selectedHjemler} setSelectedHjemler={setSelectedHjemler} />
      )}
    </VStack>
  );
};

interface HjemlerProps {
  ytelse: string;
  selectedHjemler: string[];
  setSelectedHjemler: (selected: string[]) => void;
}

const Hjemler = ({ ytelse, selectedHjemler, setSelectedHjemler }: HjemlerProps) => {
  const { data = [] } = useLatestYtelser();
  const [insert, { isLoading }] = useInsertHjemlerInSettingsMutation();

  const foundYtelse = data.find(({ id }) => id === ytelse);

  if (foundYtelse === undefined) {
    return (
      <Alert variant="error" size="small">
        Ingen ytelse funnet med ID: {ytelse}
      </Alert>
    );
  }

  if (foundYtelse.innsendingshjemler.length === 0) {
    return (
      <Alert variant="info" size="small">
        Ingen innsendingshjemler funnet for ytelse: <b>{foundYtelse.navn}</b>
      </Alert>
    );
  }

  return (
    <>
      <HStack gap="2">
        <Button
          size="small"
          variant="secondary-neutral"
          onClick={() => setSelectedHjemler(foundYtelse.innsendingshjemler.map(({ id }) => id))}
          className="shrink"
        >
          Velg alle
        </Button>

        <Button
          size="small"
          variant="secondary-neutral"
          onClick={() => setSelectedHjemler([])}
          disabled={selectedHjemler.length === 0}
        >
          Fjern alle
        </Button>
      </HStack>

      <CheckboxGroup legend="Velg hjemler" size="small" value={selectedHjemler} onChange={setSelectedHjemler}>
        <div className="flex max-h-200 flex-col flex-wrap gap-x-6 overflow-x-auto overflow-y-hidden">
          {foundYtelse.innsendingshjemler.map(({ id, navn }) => (
            <Checkbox key={id} value={id} size="small">
              {navn}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>

      <div>
        <Button
          size="small"
          variant="primary"
          className="shrink"
          icon={<CheckmarkIcon aria-hidden />}
          loading={isLoading}
          disabled={selectedHjemler.length === 0}
          onClick={() => insert({ ytelseId: ytelse, hjemmelIdList: selectedHjemler })}
        >
          Sett inn
        </Button>
      </div>
    </>
  );
};
