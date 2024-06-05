import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';
import { Nav } from '../nav/nav';
import { VersionCheckerStatus } from '../version-checker/version-checker-status';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabal
    </InternalHeader.Title>
    <Nav />
    <VersionCheckerStatus />
    <User />
  </InternalHeader>
);
