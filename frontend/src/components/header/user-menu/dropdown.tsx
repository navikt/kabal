import React from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useGetEnheterQuery, useGetValgtEnhetQuery, useSetValgtEnhetMutation } from '../../../redux-api/bruker';
import { EnhetButton, EnhetList, Enhet, Link, LinkList, StyledDropdown } from './styled-components';

interface DropdownProps {
  open: boolean;
  brukerId: string;
  close: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ open, brukerId, close }) => {
  const { data: valgtEnhet } = useGetValgtEnhetQuery(brukerId);
  const { data: enheter } = useGetEnheterQuery(brukerId ?? skipToken);

  const [setValgtEnhet] = useSetValgtEnhetMutation();
  if (!open || typeof enheter === 'undefined' || typeof valgtEnhet === 'undefined') {
    return null;
  }

  const onClickVelgEnhet = (enhetId: string) => {
    setValgtEnhet({ enhetId, navIdent: brukerId });
    close();
  };

  return (
    <StyledDropdown>
      <EnhetList>
        {enheter.map(({ id, navn }) => (
          <Enhet key={id}>
            <EnhetButton onClick={() => onClickVelgEnhet(id)} disabled={id === valgtEnhet.id}>
              {id} {navn}
            </EnhetButton>
          </Enhet>
        ))}
      </EnhetList>
      <LinkList>
        <li>
          <Link to="/innstillinger">Innstillinger</Link>
        </li>
      </LinkList>
    </StyledDropdown>
  );
};
