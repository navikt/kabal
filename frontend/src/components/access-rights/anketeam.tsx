import { ArrowUndoIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import { Box, Button, Checkbox, CheckboxGroup, Heading, HStack, Skeleton } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
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
        <Heading level="2" size="small" className="mb-4">
          Anketeam
        </Heading>
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
  const initialSelected = access.filter(({ anketeam }) => anketeam).map(({ saksbehandlerIdent }) => saksbehandlerIdent);
  const [selected, setSelected] = useState(initialSelected);
  const [updateAnketeam, { isLoading }] = useUpdateAnketeamMutation();

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
      <CheckboxGroup legend="Anketeam" onChange={setSelected} value={selected}>
        {access.map(({ saksbehandlerIdent, saksbehandlerName }) => (
          <Checkbox key={saksbehandlerIdent} value={saksbehandlerIdent} size="small">
            {saksbehandlerName} ({saksbehandlerIdent})
          </Checkbox>
        ))}
      </CheckboxGroup>

      <HStack gap="space-16">
        <Button
          size="small"
          onClick={() => {
            updateAnketeam(
              access.map(({ saksbehandlerIdent }) => ({
                saksbehandlerIdent,
                anketeam: selected.includes(saksbehandlerIdent),
              })),
            );
          }}
          loading={isLoading}
          icon={<FloppydiskIcon aria-hidden />}
        >
          Lagre
        </Button>

        <Button
          size="small"
          onClick={() => setSelected(initialSelected)}
          disabled={isLoading}
          data-color="danger"
          icon={<ArrowUndoIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </HStack>
    </Box>
  );
};

const LoadingRow = () => (
  <HStack gap="space-8">
    <Skeleton width="20px" height="32px" />
    <Skeleton width="300px" height="32px" />
  </HStack>
);
