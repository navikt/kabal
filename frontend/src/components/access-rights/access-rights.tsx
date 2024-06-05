import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import {
  SaksbehandlerAccessRights,
  useGetAccessRightsQuery,
  useUpdateAccessRightsMutation,
} from '@app/redux-api/access-rights';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { IYtelse } from '@app/types/kodeverk';
import { Body } from './body';
import { Head } from './head';

const EMPTY_ARRAY: [] = [];

export const AccessRights = () => {
  const { user } = useContext(StaticDataContext);
  const { data: ytelser = EMPTY_ARRAY } = useLatestYtelser();
  const { data, isLoading } = useGetAccessRightsQuery(user.ansattEnhet.id);

  if (isLoading || typeof ytelser === 'undefined' || typeof data === 'undefined') {
    return <Loader />;
  }

  return <AccessRightsContent ytelser={ytelser} saksbehandlere={data.accessRights} />;
};

interface Props {
  ytelser: IYtelse[];
  saksbehandlere: SaksbehandlerAccessRights[];
}

const AccessRightsContent = ({ ytelser, saksbehandlere }: Props) => {
  const [accessRights, setAccessRights] = useState(
    [...saksbehandlere].sort((a, b) => a.saksbehandlerName.localeCompare(b.saksbehandlerName)),
  );
  const [focusedCell, setFocusedCell] = useState<[number, number]>([-1, -1]);
  const [updateAccessRights, { isLoading }] = useUpdateAccessRightsMutation();

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
      accessRights: accessRights.map(({ saksbehandlerIdent, ytelseIdList }) => ({
        saksbehandlerIdent,
        ytelseIdList,
      })),
    });

  return (
    <>
      <TilgangsstyringHeading />
      <TableWrapper>
        <StyledTable onMouseLeave={() => setFocusedCell([-1, -1])}>
          <Head saksbehandlere={accessRights} focusedCell={focusedCell} setFocusedCell={setFocusedCell} />
          <Body
            ytelser={ytelser}
            accessRights={accessRights}
            onCheck={onCheck}
            focusedCell={focusedCell}
            setFocusedCell={setFocusedCell}
          />
        </StyledTable>
      </TableWrapper>
      <ButtonContainer>
        <Button variant="primary" size="small" onClick={save} loading={isLoading} icon={<CheckmarkIcon aria-hidden />}>
          Lagre
        </Button>
        <Button variant="danger" size="small" onClick={reset} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </ButtonContainer>
    </>
  );
};

const addIfNotExists = (array: string[], value: string) => (array.includes(value) ? array : [...array, value]);

const TilgangsstyringHeading = () => (
  <Heading level="1" size="medium">
    Tilgangsstyring
  </Heading>
);

const StyledTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  max-height: 100%;
`;

const TableWrapper = styled.div`
  flex-shrink: 1;
  overflow: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 16px;
`;
