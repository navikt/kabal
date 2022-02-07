import React from 'react';
import { NavLink } from 'react-router-dom';
import 'nav-frontend-knapper-style';

export const BackLink = () => (
  <NavLink to="/mineoppgaver" className="knapp knapp--mini">
    Tilbake
  </NavLink>
);
