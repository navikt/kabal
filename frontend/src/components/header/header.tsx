import { Notifications } from '@app/components/header/notifications/notifications';
import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';
import { Nav } from '../nav/nav';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabal
    </InternalHeader.Title>
    <Nav />
    <Notifications />
    <User />
  </InternalHeader>
);
