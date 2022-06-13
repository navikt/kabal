import { Header } from '@navikt/ds-react-internal';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from '../nav/nav';
import { VersionCheckerStatus } from '../version-checker/version-checker-status';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <Header>
    <Header.Title as={NavLink} to="/">
      KABAL
    </Header.Title>
    <Nav />
    <VersionCheckerStatus />
    <User />
  </Header>
);
