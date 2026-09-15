import { ArrowUndoIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { Body } from '@/components/access-rights/body';
import { Head } from '@/components/access-rights/head';
import { StaticDataContext } from '@/components/app/static-data-context';
import { CheckmarkCircleFillIconColored } from '@/components/colored-icons/colored-icons';
import {
  type SaksbehandlerAccessRights,
  useGetAccessRightsQuery,
  useUpdateAccessRightsMutation,
} from '@/redux-api/access-rights';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';
import type { IYtelse } from '@/types/kodeverk';

const EMPTY_ARRAY: [] = [];

export const AccessRights = () => {
  const { user } = useContext(StaticDataContext);
  const { data: ytelser = EMPTY_ARRAY } = useLatestYtelser();
  const { data, isLoading } = useGetAccessRightsQuery(user.ansattEnhet.id);

  if (isLoading || ytelser === undefined || data === undefined) {
    return <Loader />;
  }

  return <AccessRightsContent ytelser={ytelser} saksbehandlere={data.accessRights} />;
};

interface Props {
  ytelser: IYtelse[];
  saksbehandlere: SaksbehandlerAccessRights[];
}

const AccessRightsContent = ({ ytelser, saksbehandlere }: Props) => {
  const { user } = useContext(StaticDataContext);
  const [accessRights, setAccessRights] = useState(
    saksbehandlere.toSorted((a, b) => a.saksbehandlerName.localeCompare(b.saksbehandlerName)),
  );
  const [focusedCell, setFocusedCell] = useState<[number, number]>([-1, -1]);
  const [updateAccessRights, { isLoading, isSuccess }] = useUpdateAccessRightsMutation();

  const onCheck = (checked: boolean, ytelseId: string, saksbehandlerIdent: string | null = null) =>
    setAccessRights((prev) =>
      prev.map((saksbehandler) => {
        if (saksbehandlerIdent !== null && saksbehandler.saksbehandlerIdent !== saksbehandlerIdent) {
          return saksbehandler;
        }

        const { ytelseIdList, ...rest } = saksbehandler;

        return {
          ...rest,
          ytelseIdList: checked ? addIfNotExists(ytelseIdList, ytelseId) : ytelseIdList.filter((id) => id !== ytelseId),
        };
      }),
    );

  const reset = () => setAccessRights(saksbehandlere);

  const save = () =>
    updateAccessRights({
      enhetId: user.ansattEnhet.id,
      accessRights: accessRights.map(({ saksbehandlerIdent, ytelseIdList }) => ({
        saksbehandlerIdent,
        ytelseIdList,
      })),
    });

  const hasChanges = getHasChanges(saksbehandlere, accessRights);

  return (
    <Box overflow="hidden" height="100%" borderRadius="4" shadow="dialog" padding="space-16" className="flex flex-col">
      <Heading level="2" size="small" className="mb-4">
        Ytelser
      </Heading>

      <VStack gap="space-16" overflow="hidden" maxHeight="100%">
        <div className="overflow-auto pr-50">
          <table className="max-h-full border-separate border-spacing-0" onMouseLeave={() => setFocusedCell([-1, -1])}>
            <Head saksbehandlere={accessRights} focusedCell={focusedCell} setFocusedCell={setFocusedCell} />
            <Body
              ytelser={ytelser}
              accessRights={accessRights}
              onCheck={onCheck}
              focusedCell={focusedCell}
              setFocusedCell={setFocusedCell}
            />
          </table>
        </div>

        {hasChanges ? (
          <HStack gap="space-16">
            <Button
              variant="primary"
              size="small"
              onClick={save}
              loading={isLoading}
              icon={<FloppydiskIcon aria-hidden />}
            >
              Lagre
            </Button>
            <Button
              data-color="danger"
              variant="primary"
              size="small"
              onClick={reset}
              icon={<ArrowUndoIcon aria-hidden />}
            >
              Avbryt
            </Button>
          </HStack>
        ) : isSuccess ? (
          <BodyShort size="small">
            Lagret <CheckmarkCircleFillIconColored aria-hidden />
          </BodyShort>
        ) : null}
      </VStack>
    </Box>
  );
};

const addIfNotExists = (array: string[], value: string) => (array.includes(value) ? array : [...array, value]);

const getHasChanges = (initial: SaksbehandlerAccessRights[], state: SaksbehandlerAccessRights[]) => {
  for (const stateSb of state) {
    for (const initialSb of initial) {
      if (stateSb.saksbehandlerIdent === initialSb.saksbehandlerIdent) {
        if (
          stateSb.ytelseIdList.length !== initialSb.ytelseIdList.length ||
          !stateSb.ytelseIdList.every((id) => initialSb.ytelseIdList.includes(id))
        ) {
          return true;
        }
      }
    }
  }

  return false;
};
