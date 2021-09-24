import React from 'react';
import { useGetBrukerQuery, useSetValgtEnhetMutation } from '../../../redux-api/bruker';
import {
  StyledEnhetButton,
  EnhetList,
  Enhet,
  StyledNavLink,
  LinkList,
  StyledDropdown,
  StyledLink,
} from './styled-components';

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
            <StyledEnhetButton onClick={() => onClickVelgEnhet(id)} disabled={id === valgtEnhetView.id}>
              {id} {navn}
            </StyledEnhetButton>
          </Enhet>
        ))}
      </EnhetList>
      <LinkList>
        <li>
          <StyledNavLink to="/innstillinger">Innstillinger</StyledNavLink>
        </li>
        <li>
          <StyledLink to="/logout">Logg ut</StyledLink>
        </li>
      </LinkList>
    </StyledDropdown>
  );
};
