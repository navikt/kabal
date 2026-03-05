import { Notifications } from '@app/components/header/notifications/notifications';
import { NotificationsProvider } from '@app/components/header/notifications/state';
import { User } from '@app/components/header/user-menu/user';
import { Nav } from '@app/components/nav/nav';
import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabal
    </InternalHeader.Title>
    <Nav />
    <NotificationsProvider>
      <Notifications />
    </NotificationsProvider>
    <User />
  </InternalHeader>
);
