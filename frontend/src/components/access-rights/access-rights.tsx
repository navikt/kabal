import { Close, SuccessStroke } from '@navikt/ds-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import {
  SaksbehandlerAccessRights,
  useGetAccessRightsQuery,
  useUpdateAccessRightsMutation,
} from '../../redux-api/access-rights';
import { useUser } from '../../simple-api-state/use-user';
import { IYtelse } from '../../types/kodeverk';
import { toast } from '../toast/store';
import { ToastType } from '../toast/types';
import { Body } from './body';
import { Head } from './head';

export const AccessRights = () => {
  const { data: user, isLoading: userIsLoading } = useUser();
  const ytelser = useKodeverkValue('ytelser');
  const enhet = userIsLoading || typeof user === 'undefined' ? skipToken : user.ansattEnhet.id;
  const { data, isLoading } = useGetAccessRightsQuery(enhet);

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
    [...saksbehandlere].sort((a, b) => a.saksbehandlerName.localeCompare(b.saksbehandlerName))
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
      })
    );

  const reset = () => setAccessRights(saksbehandlere);

  const save = () =>
    updateAccessRights({
      accessRights: accessRights.map(({ saksbehandlerIdent, ytelseIdList }) => ({
        saksbehandlerIdent,
        ytelseIdList,
      })),
    }).then(() => toast({ type: ToastType.SUCCESS, message: 'Tilgangsstyring er lagret' }));

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
        <Button variant="primary" size="small" onClick={save} loading={isLoading} icon={<SuccessStroke aria-hidden />}>
          Lagre
        </Button>
        <Button variant="danger" size="small" onClick={reset} icon={<Close aria-hidden />}>
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
