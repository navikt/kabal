import React from 'react';
import { NavLink } from 'react-router-dom';

export const BackLink = () => (
  <NavLink to="/mineoppgaver" className="knapp knapp--mini footer-button">
    Tilbake
  </NavLink>
);
