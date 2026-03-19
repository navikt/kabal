import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';
import { Notifications } from '@/components/header/notifications/notifications';
import { NotificationsProvider } from '@/components/header/notifications/state';
import { User } from '@/components/header/user-menu/user';
import { Nav } from '@/components/nav/nav';

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
