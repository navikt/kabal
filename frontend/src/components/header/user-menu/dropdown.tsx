import React from 'react';
import { useGetBrukerQuery, useSetValgtEnhetMutation } from '../../../redux-api/bruker';
import { EnhetButton, EnhetList, Enhet, Link, LinkList, StyledDropdown } from './styled-components';

interface DropdownProps {
  open: boolean;
  close: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ open, close }) => {
  const { data: userData } = useGetBrukerQuery();
  const [setValgtEnhet] = useSetValgtEnhetMutation();

  if (!open || typeof userData === 'undefined') {
    return null;
  }

  const { enheter, valgtEnhetView } = userData;

  const onClickVelgEnhet = (enhetId: string) => {
    setValgtEnhet({ enhetId, navIdent: userData?.info.navIdent });
    close();
  };

  return (
    <StyledDropdown>
      <EnhetList>
        {enheter.map(({ id, navn }) => (
          <Enhet key={id}>
            <EnhetButton onClick={() => onClickVelgEnhet(id)} disabled={id === valgtEnhetView.id}>
              {id} {navn}
            </EnhetButton>
          </Enhet>
        ))}
      </EnhetList>
      <LinkList>
        <li>
          <Link to="/innstillinger">Innstillinger</Link>
        </li>
        <li>
          <Link to="/logout">Logg ut</Link>
        </li>
      </LinkList>
    </StyledDropdown>
  );
};
