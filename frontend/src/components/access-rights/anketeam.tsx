import { ArrowUndoIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import {
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Skeleton,
  TextField,
} from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { CheckmarkCircleFillIconColored } from '@/components/colored-icons/colored-icons';
import {
  type SaksbehandlerAccessRights,
  useGetAccessRightsQuery,
  useUpdateAnketeamMutation,
} from '@/redux-api/access-rights';

export const AnkeTeam = () => {
  const { user } = useContext(StaticDataContext);
  const { data, isLoading, isSuccess } = useGetAccessRightsQuery(user.ansattEnhet.id);

  if (isLoading) {
    return (
      <Box shadow="dialog" padding="space-16" width="fit-content" height="fit-content" borderRadius="4">
        <Heading level="2" size="small">
          Anketeam
        </Heading>

        <Skeleton width="100%" height="48px" className="mb-2" />

        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </Box>
    );
  }

  if (!isSuccess) {
    return null;
  }

  return <AnkeTeamLoaded access={data.accessRights} />;
};

export const AnkeTeamLoaded = ({ access }: { access: SaksbehandlerAccessRights[] }) => {
  const { user } = useContext(StaticDataContext);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(
    access.filter(({ anketeam }) => anketeam).map(({ saksbehandlerIdent }) => saksbehandlerIdent),
  );
  const [filtered, setFiltered] = useState(
    access.toSorted((a, b) => a.saksbehandlerName.localeCompare(b.saksbehandlerName)),
  );
  const [updateAnketeam, { isLoading, isSuccess }] = useUpdateAnketeamMutation();

  const hiddenSelected = access.filter(
    ({ saksbehandlerIdent }) =>
      selected.includes(saksbehandlerIdent) && !filtered.some((f) => f.saksbehandlerIdent === saksbehandlerIdent),
  );

  const resetFilter = () => {
    setFilter('');
    setFiltered(access);
  };

  const noChanges = access.every(
    ({ saksbehandlerIdent, anketeam }) => selected.includes(saksbehandlerIdent) === anketeam,
  );

  return (
    <Box
      shadow="dialog"
      padding="space-16"
      width="fit-content"
      height="fit-content"
      borderRadius="4"
      maxHeight="100%"
      overflow="auto"
      className="flex flex-col gap-4"
    >
      <Heading level="2" size="xsmall">
        Anketeam
      </Heading>

      <HStack gap="space-8" align="end">
        <TextField
          size="small"
          label="Filtrer"
          hideLabel
          placeholder="Filtrer"
          value={filter}
          onChange={({ target: { value } }) => {
            setFilter(value);

            if (value === '') {
              return setFiltered(access);
            }

            const newFiltered = access
              .filter(
                ({ saksbehandlerName, saksbehandlerIdent }) =>
                  saksbehandlerName.toLowerCase().includes(value.toLowerCase()) ||
                  saksbehandlerIdent.toLowerCase().includes(value.toLowerCase()),
              )
              .toSorted((a, b) => a.saksbehandlerName.localeCompare(b.saksbehandlerName));

            setFiltered(newFiltered);
          }}
        />
        <Button size="small" variant="secondary" onClick={resetFilter}>
          Tøm filter
        </Button>
      </HStack>

      <CheckboxGroup legend="Anketeam" onChange={setSelected} value={selected} hideLegend>
        {filtered.length === 0
          ? 'Ingen saksbehandlere å vise'
          : filtered.map(({ saksbehandlerIdent, saksbehandlerName }) => (
              <Checkbox key={saksbehandlerIdent} value={saksbehandlerIdent} size="small">
                {saksbehandlerName} ({saksbehandlerIdent})
              </Checkbox>
            ))}
      </CheckboxGroup>

      {hiddenSelected.length > 0 && (
        <HStack gap="space-4" align="center">
          <BodyShort size="small">
            {hiddenSelected.length}{' '}
            {hiddenSelected.length === 1 ? 'valgt og skjult saksbehandler' : 'valgte og skjulte saksbehandlere'}
          </BodyShort>

          <Button size="small" variant="tertiary" onClick={resetFilter}>
            Fjern filter
          </Button>
        </HStack>
      )}

      {noChanges ? (
        isSuccess ? (
          <BodyShort size="small">
            Lagret <CheckmarkCircleFillIconColored aria-hidden />
          </BodyShort>
        ) : null
      ) : (
        <HStack gap="space-16">
          <Button
            size="small"
            onClick={() => {
              updateAnketeam({
                anketeam: access.map(({ saksbehandlerIdent }) => ({
                  saksbehandlerIdent,
                  anketeam: selected.includes(saksbehandlerIdent),
                })),
                enhetId: user.ansattEnhet.id,
              });
            }}
            loading={isLoading}
            icon={<FloppydiskIcon aria-hidden />}
          >
            Lagre
          </Button>

          <Button
            size="small"
            onClick={() =>
              setSelected(access.filter(({ anketeam }) => anketeam).map(({ saksbehandlerIdent }) => saksbehandlerIdent))
            }
            disabled={isLoading}
            data-color="danger"
            icon={<ArrowUndoIcon aria-hidden />}
          >
            Avbryt
          </Button>
        </HStack>
      )}
    </Box>
  );
};

const LoadingRow = () => (
  <HStack gap="space-8">
    <Skeleton width="20px" height="32px" />
    <Skeleton width="300px" height="32px" />
  </HStack>
);
